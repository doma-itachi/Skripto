class_name BackgroundManager
extends TextureRect

@onready var background_buffer: TextureRect = $BackgroundBuffer
const TRANSITION_TIME: float = 0.3
var backgrounds: Dictionary = {}

# Called when the node enters the scene tree for the first time.
func _ready():
	#print(OS.get_cmdline_args()[1])
	load_assets()
	background_buffer.modulate.a = 0

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

# 背景画像の読み込み
func load_assets():
	var file = FileAccess.open("./resources/background/info.json", FileAccess.READ)
	var json = JSON.new()
	var error = json.parse(file.get_as_text())
	
	if error != OK:
		print("背景情報を読み込めませんでした JSON Err: ", json.get_error_message())
		return
		
	# 画像ファイルの読み込み
	for i in json.data:
		backgrounds[i.id] = Util.load_image_texture_from_file("./resources/background/"+i.id+".jpg")
		
	file.close()
	
func set_background(id: String):
	if(backgrounds.has(id)):
		background_buffer.texture = backgrounds[id]
	else:
		print("存在しない背景が指定されましたが、システムは続行されます")
		return
	
	var tween: Tween = background_buffer.get_tree().create_tween()
	tween.tween_property(background_buffer, "modulate", Color(1, 1, 1, 1), TRANSITION_TIME)
	tween.play()
	await tween.finished
	texture = backgrounds[id]
	background_buffer.modulate.a = 0
