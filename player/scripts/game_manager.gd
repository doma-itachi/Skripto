class_name GameManager
extends Control

@onready var background: BackgroundManager = $Background
@onready var bgmManager: MusicManager = $AudioStreamPlayer
@onready var message_window: MessageWindow = $MessageBox
@onready var characterManager: CharacterManager = $CharacterContainer

var parser: ScenarioParser

#id キャラクター名の辞書
var characterNames: Dictionary = {}

# Called when the node enters the scene tree for the first time.
func _ready():
	parser = ScenarioParser.new()
	
	var args := OS.get_cmdline_args()
	if 2<=args.size():
		parser.load(OS.get_cmdline_args()[1])# エディタ実行の場合
	else:
		parser.load(OS.get_cmdline_args()[0])
		
	advance()

func _input(event):
	if(event.is_action_pressed("advance")):
		advance()
	if(event is InputEventMouseButton):
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			advance()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func advance():
	var parse_result := parser.parse()
	print(parse_result.command)
	print(parse_result.arguments)
	
	if parse_result.command == "EOF":
		message_window.set_character_name("_SYSTEM")
		message_window.set_message("スクリプトの終端です")
		return
		
	if parse_result.command == "text":
		var name := ""
		if characterNames.has(parse_result.arguments[0]):
			name = characterNames[parse_result.arguments[0]]
		else:
			name = parse_result.arguments[0]
		message_window.set_character_name(name)
		message_window.set_message(parse_result.arguments[1])
	else:
		if parse_result.command == "bg":
			background.set_background(parse_result.arguments[0])
		
		elif parse_result.command == "show":
			var pos: int = parse_result.arguments[0].find(":")
			var id: String = parse_result.arguments[0].left(pos)
			var emotion: String = parse_result.arguments[0].substr(pos+1)
			characterManager.show_character(id, emotion)
		
		elif parse_result.command == "hide":
			characterManager.hide_character(parse_result.arguments[0])
		
		elif parse_result.command == "bgm":
			bgmManager.play_music(parse_result.arguments[0])
			
		elif parse_result.command == "defineCharacter":
			characterNames[parse_result.arguments[0]] = parse_result.arguments[1]
			
		advance()
