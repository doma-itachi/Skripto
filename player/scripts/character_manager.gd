class_name CharacterManager
extends Control

var characters: Dictionary

var renderedCharacters: Array[String] = []

func _ready():
	var file = FileAccess.open("./resources/character/info.json", FileAccess.READ)
	var json = JSON.new()
	var error = json.parse(file.get_as_text())
	
	if error != OK:
		print("キャラクターが読み込めませんでした。jsonが読み込めませんでした")
		return
	
	var character_scene = preload("res://Character.tscn")
	for i in json.data:
		var ch: Character = character_scene.instantiate()
		ch.init(i["id"])
		characters[i["id"]]=ch
		
		add_child(ch)
	file.close()

var fadeSpeed = 0.3
func show_character(id: String, emotion: String):
	var tween: Tween = get_tree().create_tween()
	var target: Character = characters[id]
	var isTransition: bool = !target.isShow
	
	if isTransition:
		# 描画中キャラクターに登録
		renderedCharacters.append(id)
		
		tween.tween_property($".", "modulate", Color(1, 1, 1, 0), fadeSpeed)
		tween.play()
		await tween.finished
		target.show_character(emotion)
		
		for i in renderedCharacters.size():
			(characters[renderedCharacters[i]] as Character).position.x = (i+1)*1280/(renderedCharacters.size()+1)-640
		
		var tween2: Tween = get_tree().create_tween()
		tween2.tween_property($".", "modulate", Color(1, 1, 1, 1), fadeSpeed)
		tween2.play()
		await tween.finished
	else:
		target.show_character(emotion)

func hide_character(id: String):
	var target: Character = characters[id]
	renderedCharacters.erase(id)
	var tween: Tween = get_tree().create_tween()
	tween.tween_property($".", "modulate", Color(1, 1, 1, 0), fadeSpeed)
	tween.play()
	await tween.finished
	target.hide_character()
	
	for i in renderedCharacters.size():
		(characters[renderedCharacters[i]] as Character).position.x = (i+1)*1280/(renderedCharacters.size()+1)-640
	
	var tween2: Tween = get_tree().create_tween()
	tween2.tween_property($".", "modulate", Color(1, 1, 1, 1), fadeSpeed)
	tween2.play()
	await tween.finished
	(characters[id] as Character).hide_character()
