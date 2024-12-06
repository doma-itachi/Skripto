class_name Character
extends Control

static var emotions: Array[String] = [
	"normal",
	"happy",
	"angry",
	"sad",
	"surprise"
]
static var base_path: String = "./resources/character/"
var textures: Array[ImageTexture]
var id: String
var isShow: bool = false
var fadeSpeed: float = 0.2
#func _ready():
	#pass
	
func init(id: String):
	self.id = id
	for i in Character.emotions:
		textures.append(Util.load_image_texture_from_file(base_path+id+"/"+i+".png"))
		
	$SpriteBuffer.modulate.a = 0
	
	var scale_float := 1.6
	var offset_bottom := 250
	
	var scale := Vector2(scale_float, scale_float)
	$Sprite.scale = scale
	$SpriteBuffer.scale = scale
	var offset = offset_bottom*scale_float
	$Sprite.position.y += offset
	$SpriteBuffer.position.y += offset
	
func show_character(emotion: String):
	var tex: ImageTexture = textures[emotions.find(emotion)]
	var tween: Tween = $SpriteBuffer.get_tree().create_tween()
	if isShow:
		$SpriteBuffer.texture = tex
		tween.tween_property($SpriteBuffer, "modulate", Color(1, 1, 1, 1), fadeSpeed)
		tween.play()
		await tween.finished
	$Sprite.texture = tex
	$Sprite.modulate.a = 1
	$SpriteBuffer.modulate.a = 0
	isShow = true
	
func hide_character():
	isShow = false
	$Sprite.modulate.a = 0
