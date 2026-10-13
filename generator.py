import random
import string

def generate_whatsapp_flood_links(phone_number, count=300):
    clean_number = ''.join(filter(str.isdigit, phone_number))
    links = []
    for i in range(count):
        random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        link = f"https://wa.me/{clean_number}?text=KLAUS_BAN_{random_suffix}"
        links.append(link)
    return links

if __name__ == "__main__":
    target_num = input("Entrez le numéro cible : ")
    final_links = generate_whatsapp_flood_links(target_num, 300)
    with open("klaus_flood_list.txt", "w") as f:
        for link in final_links:
            f.write(link + "\n")
    print(f"[+] Terminé ! {len(final_links)} liens générés.")
