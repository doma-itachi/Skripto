class_name Util
extends Node

static func load_image_texture_from_file(filepath: String) -> ImageTexture:
	var image = Image.new()
	image.load(filepath)
	return ImageTexture.create_from_image(image)

static func load_audio_from_file(filepath: String) -> AudioStream:
	var music = AudioStreamOggVorbis.new()
	var bytes = FileAccess.get_file_as_bytes(filepath)
	return music.load_from_buffer(bytes)
