#!/usr/bin/env python3
"""line.py guy|vivian used.txt -> prints 8 candidate lines from ChatGPT (gpt-5), one per line. YOU pick/edit the best.
Key: OPENAI_KEY_FILE (default ~/.secrets/openai). Never print the key."""
import sys, os, json, urllib.request
who, used = sys.argv[1], (open(sys.argv[2]).read()[-6000:] if len(sys.argv) > 2 and os.path.exists(sys.argv[2]) else '')
k = open(os.environ.get('OPENAI_KEY_FILE', os.path.expanduser('~/.secrets/openai'))).read().strip()
STYLE = {
 'guy': """You write the on-screen text for a Christian guy's TikTok (early 20s; like @yeetyghost / @ozono20 but faith-oriented).
Shapes that work: "the older i get, the more i realize…"; "if…, why…? maybe…"; "there's this girl… and she's reading this right now";
"i'll stop praying for you when [impossible things]"; "someone said: '…' and i really felt that"; "i'm single because i actually want…";
gentle reassurance ("no one is too far gone…"). Mostly about faith + relationships, wanting a godly partner, friendship, loneliness, healing, trusting God.""",
 'vivian': """You write the one small line on a Christian girl's TikTok photo (about 21; like @secret_shitz but faith-oriented).
Three kinds: confession ("i could be mad at God and still talk to him every night"); "the day a man…/when he's a … type";
"you deserve…".""",
}[who]
prompt = STYLE + """
Rules: lowercase (except God/Jesus/Christ/Bible), lazy punctuation, sincere, warm, never preachy, never telling people what they must do,
never mocking God/the Bible/church, never a specific church day, no hashtags, no emojis, no app names, max 40 words.
Original — never copy known creators' lines. Not these already-used lines:
""" + used + "\nGive 8 different lines, one per line, no labels or numbers, nothing else. Plain words a real 21-year-old would post — no clever poetic metaphors."
body = {"model": "gpt-5", "input": prompt}
r = urllib.request.Request('https://api.openai.com/v1/responses', data=json.dumps(body).encode(),
                           headers={'Authorization': 'Bearer ' + k, 'Content-Type': 'application/json'})
d = json.load(urllib.request.urlopen(r, timeout=180))
print('\n'.join(c['text'] for o in d['output'] if o.get('type') == 'message' for c in o['content']).strip())
