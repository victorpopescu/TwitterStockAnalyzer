import sys
import argparse
import json
from controllers.TwitterDumpController import *
from controllers.SentiWordNetController import *
import dateutil.parser


def main():

    parser = argparse.ArgumentParser(description="Generates sentiment analysis data a")
    parser.add_argument("file", type=str, default="", help="The Twitter dump's path.")
    
    parser.add_argument("--output", type=argparse.FileType("w"), default=sys.stdout, help="The file to which the output should be redirected. Default is stdout.")
    
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--sentiwordnet", type=str, help="Generate sentiment analysis with the SentiWordNet lexicon provided")
    group.add_argument("--textblob", action="store_true", help="Generate sentiment analysis with the TextBlob module")
    group.add_argument("--smileys", action="store_true", help="Generate sentiment analysis based on the presence of smileys")
    

    global args
    args = parser.parse_args()


    # Load tweets
    twitterDumpController = TwitterDumpController(args.file)
    tweets = twitterDumpController.load()

    # Analyze tweets
    result = {}

    if args.sentiwordnet != None:
        print "Loading SentiWordNet lexicon.."
        sentiWordNetController = SentiWordNetController(args.sentiwordnet)
        sentiWordNetController.load()
        print "Loaded SentiWordNet lexicon."

        print "Analyzing tweets.."
        count = 0
        for tweet in tweets:
            tweetAnalysis = sentiWordNetController.analyzeSentence(tweet["text"])

            date = dateutil.parser.parse(tweet["created_at"]).strftime("%Y-%m-%d")

            if date in result:
                result[date].append(tweetAnalysis)
            else:
                result[date] = [tweetAnalysis]

            count += 1
            if count % 500 == 0:
                print "Analyzed", count, "tweets.."

        print "Analyzed", count, "tweets."

    elif args.textblob == True:
        from textblob import TextBlob

        print "Analyzing tweets.."
        count = 0
        for tweet in tweets:
            blob = TextBlob(tweet["text"])

            tweetAnalysis = {"polarity": 0, "subjectivity": 0}
            for sentence in blob.sentences:
                tweetAnalysis["polarity"] += sentence.sentiment.polarity
                tweetAnalysis["subjectivity"] += sentence.sentiment.subjectivity
            if len(blob.sentences) > 0:
                tweetAnalysis["polarity"] /= len(blob.sentences)
                tweetAnalysis["subjectivity"] /= len(blob.sentences)

            date = dateutil.parser.parse(tweet["created_at"]).strftime("%Y-%m-%d")

            if date in result:
                result[date].append(tweetAnalysis)
            else:
                result[date] = [tweetAnalysis]

            count += 1
            if count % 500 == 0:
                print "Analyzed", count, "tweets.."

        print "Analyzed", count, "tweets."

    elif args.smileys == True:
        print "Analyzing tweets.."
        count = 0
        for tweet in tweets:
            tweetAnalysis = {"sentiment": 0}
            if any([x in tweet["text"] for x in [":)", ":D", ":d", ";)", "=)", ":>"]]):
                tweetAnalysis = {"sentiment": 1}
            elif any([x in tweet["text"] for x in [":(", ";(", "=(", ":<"]]):
                tweetAnalysis = {"sentiment": -1}

            date = dateutil.parser.parse(tweet["created_at"]).strftime("%Y-%m-%d")

            if date in result:
                result[date].append(tweetAnalysis)
            else:
                result[date] = [tweetAnalysis]

            count += 1
            if count % 500 == 0:
                print "Analyzed", count, "tweets.."

        print "Analyzed", count, "tweets."


    args.output.write(json.dumps(result))
    args.output.close()


if __name__ == "__main__":
    main()
