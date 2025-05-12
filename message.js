const mensagens = [
    'viva a indieweb!',
    'rm -rf /*',
    'esse site foi feito por humanos',
    './lexpdev.sh',
    'i use arch btw',
    ':(){:|:&};:',
    '¯\\_(ツ)_/¯',
    'ᕕ( ᐛ )ᕗ',
    'fazer site é difícil hein...',
    '>··<',
    'Would you. Could you. On a train?'
];
document.getElementById('mensagem').textContent = mensagens[Math.floor(Math.random() * mensagens.length)];