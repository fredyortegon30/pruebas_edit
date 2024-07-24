// main.js

// We'll use localStorage instead of Google Sheets for data persistence
function saveText(text) {
    localStorage.setItem('savedText', text);
    return 'Text saved successfully';
}

function loadText() {
    return localStorage.getItem('savedText') || '';
}

function formatText(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('editor').focus();
}

function insertList(type) {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
    document.getElementById('editor').focus();
}

function insertLink() {
    var url = prompt('Enter the URL of the link:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage() {
    var url = prompt('Enter the URL of the image:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
}

function cleanHTML(html) {
    const allowedTags = ['a', 'b', 'strong', 'i', 'u', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'li', 'ol', 'ul', 'blockquote', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    
    function cleanNode(node) {
        if (node.nodeType === 1) {
            if (!allowedTags.includes(node.tagName.toLowerCase())) {
                while (node.firstChild) {
                    node.parentNode.insertBefore(node.firstChild, node);
                }
                node.parentNode.removeChild(node);
            } else {
                Array.from(node.attributes).forEach(attr => {
                    if (attr.name !== 'href' && attr.name !== 'src') {
                        node.removeAttribute(attr.name);
                    }
                });
                
                Array.from(node.childNodes).forEach(cleanNode);
            }
        }
    }
    
    Array.from(tmp.childNodes).forEach(cleanNode);
    
    return tmp.innerHTML.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');
}

function save() {
    const text = document.getElementById('editor').innerHTML;
    const cleanedText = cleanHTML(text);
    const message = saveText(cleanedText);
    showMessage(message);
}

function load() {
    const text = loadText();
    document.getElementById('editor').innerHTML = text;
    showMessage('Text loaded successfully');
}

function showMessage(message) {
    const messageElem = document.getElementById('message');
    messageElem.innerText = message;
    messageElem.classList.add('success');
    setTimeout(() => messageElem.classList.remove('success'), 3000);
}

// Load the text when the application starts
window.onload = load;