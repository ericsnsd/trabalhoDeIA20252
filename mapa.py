import pandas as pd
import os
from colorama import init, Fore, Back, Style

def carregarMapaExcel():
    arquivosExcel = [f for f in os.listdir('.') if f.endswith('.xlsx')]
    if not arquivosExcel:
        print("Nenhum arquivo na pasta.")
        return None
    
    arquivoExcel = arquivosExcel[0]
    print(f"Carregando mapa do arquivo: {arquivoExcel}")
    
    try:
        df = pd.read_excel(arquivoExcel, header=None)
        return df.values
    except Exception as e:
        print(f"Erro ao carregar arquivo .xlsx: {e}")
        return None

def corConsole(value):
    if value == 0:
        return Fore.WHITE + Back.GREEN + Style.BRIGHT
    elif 1 <= value <= 12:
        return Fore.BLACK + Back.CYAN + Style.BRIGHT
    elif value == 13:
        return Fore.WHITE + Back.MAGENTA + Style.BRIGHT
    elif value == 14:
        return Fore.WHITE + Back.RED + Style.BRIGHT
    elif value == 15:
        return Fore.BLACK + Back.YELLOW + Style.NORMAL
    elif value == 16:
        return Fore.WHITE + Back.BLUE + Style.NORMAL
    return Fore.WHITE + Back.BLACK

def mostrarMapa(matrizMapa):
    if matrizMapa is None:
        return
    
    legenda = {
        0: "Partida/Entrada do santuário",
        1: "Casa de Áries", 2: "Casa de Touro", 3: "Casa de Gêmeos",
        4: "Casa de Câncer", 5: "Casa de Leão", 6: "Casa de Virgem",
        7: "Casa de Libra", 8: "Casa de Escorpião", 9: "Casa de Sagitário",
        10: "Casa de Capricórnio", 11: "Casa de Aquário", 12: "Casa de Peixes",
        13: "Chegada/Casa do Grande Mestre", 14: "Montanhoso: +200 minutos",
        15: "Plano: +1 minuto", 16: "Rochoso: +5 minutos"
    }
    
    simbolos = {
        0: "S", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 
        7: "7", 8: "8", 9: "9", 10: "X", 11: "Y", 12: "Z", 13: "F",
        14: "M", 15: "P", 16: "R"
    }
    
    print("\n=== MAPA DO SANTUÁRIO ===\n")
    rows, cols = matrizMapa.shape
    
    for i in range(rows):
        for j in range(cols):
            value = matrizMapa[i, j]
            print(corConsole(value) + simbolos.get(value, "?") + Style.RESET_ALL, end=" ")
        print()
    
    print("\n=== LEGENDA ===")
    for key, value in legenda.items():
        print(corConsole(key) + simbolos[key] + Style.RESET_ALL + f": {value}")

def main():
    try:
        init()
        matrizMapa = carregarMapaExcel()
        if matrizMapa is not None:
            mostrarMapa(matrizMapa)
        else:
            print("Arquivo .xlsx não encontrado.")
    except ImportError:
        print("Instalar módulos necessários.")

main()
