"""
Video - VOZ MASCULINA DAVID
"""
import subprocess
import os
from pathlib import Path
import pyttsx3

BASE_DIR = Path(r"c:\Users\alexp\OneDrive\Documentos\_Proyectos\SEGURITI-USC\video_presentacion")
CLIPS_DIR = Path(r"c:\Users\alexp\OneDrive\Documentos\_Proyectos\SEGURITI-USC\docs\images")

CLIPS = [
    CLIPS_DIR / "cv_intro_eye_1765352245536.mp4",
    CLIPS_DIR / "cv_eco_tech_1765352222464.mp4", 
    CLIPS_DIR / "cv_architect_holo_1765352204492.mp4",
    CLIPS_DIR / "cv_digital_ops_1765352273224.mp4",
    CLIPS_DIR / "cv_contact_card_1765352290135.mp4",
]

# Texto en inglés para voz David
NARRATIONS = [
    "I am Alex Espinosa. Engineer. Innovator. Builder of the future.",
    "For over 21 years, I have designed systems that protect our planet. Treatment plants. Waste management. ISO 14001 Auditor.",
    "Over 100 residential projects in California. From 50 thousand to half a million dollars. Perfect code. Every time.",
    "Today, I fuse engineering with Artificial Intelligence. Creating autonomous systems. Automating the impossible. Orion. Jarvis. The future is now.",
    "Ready to transform your vision into reality? Contact me."
]

def generate_tts(text, output_file):
    engine = pyttsx3.init()
    # FORZAR voz David (masculina - índice 0)
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)  # David = índice 0
    engine.setProperty('rate', 150)
    engine.save_to_file(text, str(output_file))
    engine.runAndWait()
    print(f"✅ {output_file.name}")

def get_duration(file_path):
    cmd = f'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "{file_path}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    try:
        return float(result.stdout.strip())
    except:
        return 5.0

def create_segment(clip_path, audio_path, output_path, index):
    audio_duration = get_duration(audio_path)
    target_duration = audio_duration + 1.0
    cmd = f'ffmpeg -y -stream_loop -1 -i "{clip_path}" -i "{audio_path}" -t {target_duration} -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[v]" -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "{output_path}"'
    subprocess.run(cmd, shell=True, capture_output=True)
    print(f"✅ Seg {index}")

def concat_videos(segment_files, output_file):
    list_file = BASE_DIR / "concat_list.txt"
    with open(list_file, 'w') as f:
        for seg in segment_files:
            f.write(f"file '{seg}'\n")
    subprocess.run(f'ffmpeg -y -f concat -safe 0 -i "{list_file}" -c copy "{output_file}"', shell=True, capture_output=True)

def main():
    print("🎬 VOZ MASCULINA DAVID...")
    
    audio_files = []
    for i, text in enumerate(NARRATIONS, 1):
        audio_path = BASE_DIR / f"narr_{i}.wav"
        generate_tts(text, audio_path)
        audio_files.append(audio_path)
    
    print("\n🎥 Segmentos...")
    segment_files = []
    for i, (clip, audio) in enumerate(zip(CLIPS, audio_files), 1):
        segment_path = BASE_DIR / f"seg_{i}.mp4"
        create_segment(clip, audio, segment_path, i)
        segment_files.append(segment_path)
    
    final_video = BASE_DIR / "Alex_Espinosa_Presentacion.mp4"
    concat_videos(segment_files, final_video)
    
    for f in audio_files + segment_files:
        if f.exists(): f.unlink()
    (BASE_DIR / "concat_list.txt").unlink(missing_ok=True)
    
    print(f"\n🎉 LISTO!")
    os.startfile(str(final_video))

if __name__ == "__main__":
    main()
