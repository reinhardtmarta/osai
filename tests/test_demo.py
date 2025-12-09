import sys
sys.path.append('../examples')
from infiniteos_phi_demo import main  # Ajusta import

def test_phi_demo():
    result = main()  # Chama a função principal
    assert 'demo' in str(result).lower()  # Verifica output básico
