const mensagens = [
    'long live indieweb!',
    'rm -rf /*',
    'this website was made by humans',
    './lexpdev.sh',
    'i use arch btw',
    ':(){:|:&};:',
    '¯\\_(ツ)_/¯',
    'ᕕ( ᐛ )ᕗ',
    'making websites is hard...',
    '>··<',
    'Would you. Could you. On a train?'
];
document.getElementById('mensagem').textContent = mensagens[Math.floor(Math.random() * mensagens.length)];