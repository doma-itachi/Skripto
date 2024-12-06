class_name MessageWindow
extends TextureRect

var file_path = "./resources/frame.png"
var margin_bottom = 12

@onready var name_label: Label = $Name
@onready var text_label: RichTextLabel = $Text

const NAME_LABEL_OFFSET: Vector2 = Vector2(115, 7)
const NAME_LABEL_FONTSIZE: int = 26

const TEXT_LABEL_OFFSET: Vector2 = Vector2(30, 56)
const TEXT_LABEL_FONTSIZE: int = 26

const  TEXT_SPEED: int = 30
var text_visible_position: float = 0

const WINDOW_ALPHA: float = 0.9

var isVisible: bool = true

func _ready():
	texture = Util.load_image_texture_from_file(file_path)
	position.y -= margin_bottom
	setVisibility(true)
	
	name_label.set_position(NAME_LABEL_OFFSET)
	name_label.add_theme_font_size_override("font_size", NAME_LABEL_FONTSIZE)
	
	text_label.set_position(TEXT_LABEL_OFFSET)
	text_label.set_size(Vector2(size.x-2*TEXT_LABEL_OFFSET.x, size.y-TEXT_LABEL_OFFSET.y))
	text_label.add_theme_font_size_override("normal_font_size", TEXT_LABEL_FONTSIZE)	
	
func _input(event):
	# スペースでウィンドウを隠す
	if(event.is_action_pressed("hide_message")):
		set_character_name("検事")
		set_message("あのイーハトーヴォの")
		setVisibility(!isVisible)
		
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if(text_label.visible_characters<text_label.text.length()):
		text_visible_position+=delta*TEXT_SPEED
		text_label.visible_characters=text_visible_position

func set_character_name(name: String): 
	name_label.text = name

func set_message(text: String):
	text_label.text = text
	text_label.visible_characters = 0
	text_visible_position = 0

# ウィンドウの可視性を設定
func setVisibility(visibility: bool):
	isVisible = visibility
	if(isVisible):
		modulate.a = WINDOW_ALPHA
	else:
		modulate.a = 0
