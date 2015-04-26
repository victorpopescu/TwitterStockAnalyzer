import json

class TwitterDumpController:

	def __init__(self, url):
		self.url = url
		self.data = []

	def load(self):
		print "Loading tweets.."
		with open(self.url) as tweetsDump:
			count = 0
			for line in tweetsDump:
				self.data.append(json.loads(line))
				count += 1
				if count % 500 == 0:
					print "Loaded", count, "tweets.."
		print "Loaded", count, "tweets."

		return self.data
