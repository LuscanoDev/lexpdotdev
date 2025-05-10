
document.addEventListener('DOMContentLoaded', function() {
    if (navigator.language.startsWith('en') && !localStorage.getItem('dontAskLanguage')) {
        createLanguageWarning();
    }
});

function createLanguageWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-language';
    warningDiv.innerHTML = `
        <div class="wl-container">
            <h3 class="colorp">your browser's set to english. switch to english version?</h3>
            <div class="wl-links">
                <a href="#" id="switchToEnglish">yes, please!</a>
                <a href="#" id="keepPortuguese" style="color: #fff; opacity: 0.5;">nah, i'm fine</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(warningDiv);
    
    document.getElementById('switchToEnglish').addEventListener('click', function(e) {
        e.preventDefault();
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/en/')) {
            window.location.href = '/en' + currentPath;
        }
    });
    
    document.getElementById('keepPortuguese').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('dontAskLanguage', 'true');
        warningDiv.remove();
        alert("ok! we won't ask again.")
    });
}