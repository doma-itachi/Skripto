class_name MusicManager
extends AudioStreamPlayer

var tracks: Dictionary = {}

# Called when the node enters the scene tree for the first time.
func _ready():
	load_assets()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func load_assets():
	var file = FileAccess.open("./resources/music/info.json", FileAccess.READ)
	var json = JSON.new()
	var error = json.parse(file.get_as_text())
	
	if(error!=OK):
		print("音楽情報を読み込めませんでした JSON Err: ", json.get_error_message())
		return
	
	for i in json.data:
		var track: AudioStreamOggVorbis = Util.load_audio_from_file("./resources/music/"+i.id+".ogg")
		(track as AudioStreamOggVorbis).loop = true
		tracks[i.id] = track
		
	
	file.close()
	
func play_music(id: String):
	stream = tracks[id]
	play()
