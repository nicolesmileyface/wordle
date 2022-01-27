import json

results = {}

with open('./popular.txt', 'r') as f:
    for word in f.readlines():
        word = word.strip()
        if word == word.lower():
            if str(len(word)) not in results:
                results[str(len(word))] = [word]
            else:
                results[str(len(word))].append(word)

# for k, v in results.items():
    # if len(v) > int(k):
    #     with open('./'+k+'.json', 'w') as f:
    #         json.dump(v, f)

with open('./out.json', 'w') as f:
    json.dump(results, f)
