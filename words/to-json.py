import json
from copy import deepcopy

results = {}

with open('./popular.txt', 'r') as f:
    for word in f.readlines():
        word = word.strip()
        if word == word.lower():
            if str(len(word)) not in results:
                results[str(len(word))] = [word]
            else:
                results[str(len(word))].append(word)

trimmed_results = deepcopy(results)

for k, v in results.items():
    if len(v) <= int(k):
        del trimmed_results[k]

with open('./out.json', 'w') as f:
    json.dump(trimmed_results, f, indent=2)
