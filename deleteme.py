import random

# Gen Alpha Slang Words Lists

# N words
n_slang_words = ['Ngl', 'No-cap', 'Natty']
# n_slang_words = [
#     # Original list
#     "Newb",
#     "Nano-flex",
#     "Nextie",
#     "No-cap",
#     "Nerfed",
#     "Nunya",
#     "NPC",
#     "Narb",
#     "Nudge",
#     "Noice",
#     "Not it",
#     "No shot",
#     "Noms",
#     "Nepotism baby",
#     "Normie",
#     "Ngl",
#     "Noted",
#     "N00b",
#     "Na",
#     "Nab",
#     "Nada",
#     "Narc",
#     "Natty",
#     "Neek",
#     "Neet",
#     "Noob",
#     "Nop",
#     "Noppers",
#     "Norp",
#     "Nuke",
#     "Nurse",
#     "Nyctophile",
#     "No ragrets",
# ]

# P words
p_slang_words = [
    # Original list
    "POV",
    "Poggers",
    "Purr",
    "Phub",
    "Pressed",
    "Pushing P",
    "Petty Betty",
    "Periodt",
    "PPAP",
    "Pull up",
    "Peep",
    "Pwned",
    "Problematic",
    "PFP",
    "Peak",
    "Plug",
    "Psych",
    # Added from Urban Dictionary
    "Packy",
    "Packing",
    "Paddy",
    "Peng",
    "Pepega",
    "Phishing",
    "Phat",
    "P0wned",
    "Plug walk",
    "PMPL",
    "Pog",
    "Preem",
    "Pookie",
    "Presha",
    "Procaffeinating",
    "Pwn",
    "Playa",
    "Phablet",
    "Pizzagate",
]

# C words
c_slang_words = ['Chads']
# c_slang_words = [
#     # Original list
#     "Cheugy",
#     "Cap",
#     "Cringe",
#     "Checked",
#     "Core",
#     "Clutch",
#     "Chad",
#     "Clout",
#     "Canceled",
#     "Clapback",
#     "Cursed",
#     "Clean",
#     "Copium",
#     "Catfish",
#     "Carry",
#     "Cringey",
#     "Certified",
#     "Chief",
#     "Clickbait",
#     "C2",
#     "Cabbage",
#     "Cake",
#     "Capping",
#     "Crackberry",
#     "Crunk",
#     "Cyberslacking",
#     "Clapped",
#     "Cuffing season",
#     "Cooked",
#     "Clown",
#     "Clout chaser",
#     "Crispy",
#     "Cray",
#     "Chef's kiss",
#     "Cursed image",
#     "Charlie",
#     "Chonky",
#     "Choccy milk",
#     "Chill pill",
# ]

# Combined list of all slang words
all_slang_words = n_slang_words + p_slang_words + c_slang_words


# Example usage:
# print(f"Total slang words: {len(all_slang_words)}")
# print(f"N words: {n_slang_words}")
# print(f"P words: {p_slang_words}")
# print(f"C words: {c_slang_words}")
def generate_random_phrase(num_phrases=1):
    """
    Generate random phrases by selecting one word from each list

    Args:
        num_phrases (int): Number of random phrases to generate

    Returns:
        list: List of generated phrases
    """
    phrases = []

    for _ in range(num_phrases):
        n_word = random.choice(n_slang_words)
        p_word = random.choice(p_slang_words)
        c_word = random.choice(c_slang_words)

        phrase = f"{n_word} {p_word} {c_word}"
        phrases.append(phrase)

    return phrases


# Generate multiple phrases
print("\nMultiple random phrases:")
random_phrases = generate_random_phrase(20)
for phrase in random_phrases:
    print(phrase)
