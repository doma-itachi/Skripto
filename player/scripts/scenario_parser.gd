class_name ScenarioParser
extends Object

var scenario: Array[String]

func load(file_path: String):
	var file := FileAccess.open(file_path, FileAccess.READ)
	if(file==null):
		push_error("スクリプトが読み込めません")
		
	var text = file.get_as_text()
	file.close()
	
	for i in text.split("\n"):
		if(i.length()>1):
			scenario.append(i.strip_edges())

func parse() -> ParseResult:
	if scenario.is_empty():
		return ParseResult.new("EOF", [])
	
	var line: String = scenario.pop_front() as String
	if line.begins_with("["):
		var result = line.substr(1, line.length() - 2).split(" ")
		return ParseResult.new(result[0], [result[1]])
	elif line.begins_with("#defineCharacter"):
		var sp = line.split("\"")
		return ParseResult.new("defineCharacter", [sp[1], sp[3]])
	else:
		var start_position: int = line.find("「")
		if(start_position == -1):
			return ParseResult.new("text", ["", line])
		else:
			var id = line.substr(0, start_position)
			var text = line.substr(start_position)
			return ParseResult.new("text", [id, text])
	
	

class ParseResult:
	var command: String
	var arguments: Array[String]
	
	func _init(command: String, args: Array[String]):
		self.command = command
		self.arguments = args
