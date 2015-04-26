import re

class SentiWordNetController:
	
	def __init__(self, url):
		self.url = url
		self.data = []

	def load(self):
		# Load file
		file = open(self.url)
		self.data = file.readlines()

		# Split on tabs
		for index, value in enumerate(self.data):
			self.data[index] = value.split("\t")

		# Remove irrelevant lines
		self.data[:] = [x for x in self.data if x[0] in ["a", "b", "v"]]

		# Format lines
		for index, value in enumerate(self.data):
			temp = {}
			temp["id"] = value[1]
			temp["positive"] = float(value[2])
			temp["negative"] = float(value[3])
			temp["words"] = map(lambda x: x.split("#", 1)[0], value[4].split())
			self.data[index] = temp

	def analyzeSentence(self, sentence):
		result = {}
		result["positive"] = 0
		result["negative"] = 0

		sentence = sentence.encode("ascii", "ignore")
		sentence = sentence.lower()
		sentence = re.sub(r"[^a-z]+", " ", sentence)
		for index, value in enumerate(sentence.split()):
			temp = self.analyzeWord(value)
			result["positive"] += temp["positive"]
			result["negative"] += temp["negative"]

		return result			

	def analyzeWord(self, word):
		result = {}
		result["positive"] = 0
		result["negative"] = 0

		for index, value in enumerate(self.data):
			if word in value["words"]:
				result["positive"] += value["positive"]
				result["negative"] += value["negative"]

		return result
