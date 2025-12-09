const mensagens = [
    'viva a indieweb!',
    'rm -rf /*',
    'esse site foi feito por humanos!',
    './lexpdev.sh',
    ':(){:|:&};:',
    '¯\\_(ツ)_/¯',
    'ᕕ( ᐛ )ᕗ',
    'fazer site é difícil hein...',
    '>··<',
    'Would you. Could you. On a train?',
    'se chama lexpdev, mas cade a parte do dev?',
    'você deveria criar o seu próprio site',
    'meowgic is real!',
    'agora é a melhor época para fazer arte. FAÇA AGORA!',
    'pare de atualizar a pagina! >:(',
    'tem gente que realmente lê isso?',
    'seja livre e use linux!'
];
document.getElementById('mensagem').textContent = mensagens[Math.floor(Math.random() * mensagens.length)];
