window.onload = () => {
    LD();
    if (document.querySelector('html').getAttribute('mode') == "light") {
        const LD = document.querySelector("#LD > i");
        const h2 = document.querySelector("#LD > h2");
        LD.className = "fa fa-moon";
            h2.innerText = "مظلم";
    }
}

const LD = () => {
    document.getElementById('LD').onclick = () => {
        const LD = document.querySelector("#LD > i");
        const h2 = document.querySelector("#LD > h2");
        if (document.querySelector('html').getAttribute('mode') == 'light') {
            LD.className = "fa fa-sun";
            h2.innerText = "مشرق";
            document.querySelector('html').setAttribute('mode', 'dark');
            document.cookie = "mode=dark; domain=localhost; path=/";
        } else {;
            LD.className = "fa fa-moon";
            h2.innerText = "مظلم";
            document.querySelector('html').setAttribute('mode', 'light');
            document.cookie = "mode=light; domain=localhost; path=/";
        }
    }
}

const search = () => {
    var text = document.querySelector('body header input').value.toLowerCase();
    console.clear();
    document.querySelectorAll('body main li').forEach(li => {
        li.style.display = 'none';
        if (li.querySelector('h3').innerText.toLowerCase().includes(text)) {
            li.style.display = 'block';
        }
        if (li.querySelector('h6').innerText.toLowerCase().includes(text)) {
            li.style.display = 'block';
        }
        if (li.querySelector('p').innerText.toLowerCase().includes(text)) {
            li.style.display = 'block';
        }
    });
}