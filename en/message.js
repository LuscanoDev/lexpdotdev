const mensagens = [
    'long live indieweb!',
    'rm -rf /*',
    'this website was made by humans!',
    './lexpdev.sh',
    ':(){:|:&};:',
    '¯\\_(ツ)_/¯',
    'ᕕ( ᐛ )ᕗ',
    'making websites is hard...',
    '>··<',
    'Would you. Could you. On a train?',
    'trans rights!',
    "it's called lexpdev, but where's the dev part?",
    'you should make your own website',
    'meowgic is real!',
    'now is the best time to make art. DO IT NOW!',
    'stop refreshing the page! >:(',
    'do people actually read this..?',
    'be free and use linux!',
    '"XD"'
];
document.getElementById('mensagem').textContent = mensagens[Math.floor(Math.random() * mensagens.length)];
