let rootList = null;
let rootEmptyArea = null;
let lesson = null;
let lastLesson = null;
let nextLesson = null;

// elements
function definding() {
rootList = document.querySelector("body > aside > ul");
rootEmptyArea = document.querySelector("body > aside > #empty-area");
}

// window
window.onload = e => {
    definding();
    if (root.length) sortRoot();
    addTitle(title);
    addFields();
    if (document.querySelector('html').getAttribute('mode') == "light") document.querySelector("#LD > h2").innerText = "مظلم";
}

// functions
const drawer = () => {
    document.querySelector("body > aside").classList.toggle("slide-in");
}
const addTitle = (title) => {
    document.querySelector("body > aside > h1").innerText = title;
}

const addFields = () => {
    fields.forEach(e => {
        var a = document.createElement('a');
        if (e._id == id) a.className = "selected";
        a.innerText = e.title;
        var link = "../feild/" + e._id;
        a.href = link;
        document.querySelector('body > nav').appendChild(a);
    });
}

const sortRoot = () => {
    if (root.length) root.forEach((v, i) => {
        rootEmptyArea.classList.add('d-none');
        if (v.type == "Le") {
            addLesson(rootList, v);
        }
        if (v.type == "Li") {
            addList(rootList, v);
        }
    });
}

const addLesson = (parentElement, {title, _id}) => {
    var li = document.createElement('li');
    li.innerText = title;
    li.className = "lesson";
    li.onclick = async e => {
        document.querySelectorAll('.lesson').forEach((element, index, array) => {
            if (li.isSameNode(element)) {
                if (index == 0) {
                    lastLesson = null;
                } else lastLesson = index - 1;
                if (index == array.length - 1) {
                    nextLesson = null;
                } else nextLesson = index + 1;
                lesson = index;
            };
            element.classList.remove('selected');
        });
        li.classList.add('selected');
        await fetch('./lesson?id='+_id)
        .then(v => v.json())
        .then(v => writeMainPage(v))
        .finally(() => drawer());
    };
    parentElement.appendChild(li);
}

const addList = (parentElement, {title, content}) => {
    var ul = document.createElement('ul');
    var h3 = document.createElement('h3');
    h3.innerText = title;
    ul.appendChild(h3);
    if (content.length) {
        content.forEach(v => {
            if (v.type == "Le") addLesson(ul, v);
            if (v.type == "Li") addList(ul, v);
        });
    } else {
        ul.innerHTML += rootEmptyArea.outerHTML;
        ul.querySelector('p').classList.remove('d-none')
    }
    parentElement.appendChild(ul);
}

const writeMainPage = ({title, date, content, foldername}) => {
    const main = document.querySelector("body > main");
    main.innerHTML = "";
    const onlyReadArea = document.createElement('div');
    const h1 = document.createElement('h1');
    const h6 = document.createElement('h6');
    const h3 = document.createElement('h4');
    const control = document.createElement('div');
    const ending = document.createElement('div');
    const btns = document.createElement('span');
    const b1 = document.createElement('button');
    const b2 = document.createElement('button');
    btns.className = "btns";
    if (lastLesson != null) {
        var l = document.querySelectorAll('.lesson')[lastLesson];
        b1.innerHTML = `<pre>السابق</pre><pre>${l.innerText}</pre><i></i>`;
        b1.onclick = e => document.querySelectorAll('.lesson')[lastLesson].click();
        btns.appendChild(b1);
    }
    if (nextLesson != null) {
        var l = document.querySelectorAll('.lesson')[nextLesson];
        b2.innerHTML = `<pre>التالي</pre><pre>${l.innerText}</pre><i></i>`;
        b2.onclick = e => document.querySelectorAll('.lesson')[nextLesson].click();
        btns.appendChild(b2);
    }
    control.id = "control";
    onlyReadArea.id = "only-read-area";
    ending.id = "ending";
    onlyReadArea.innerHTML = content;
    onlyReadArea.querySelectorAll('img').forEach(img => {
        var name = img.src.split('/')[img.src.split('/').length - 1];
        img.setAttribute('src', `${foldername}/imgs/${name}`);
    });
    onlyReadArea.querySelectorAll('table').forEach(t => {
        var tabel = t;
        var div = document.createElement('div');
        t.replaceWith(div);
        div.className = 'tableContaner';
        div.appendChild(tabel);
    });
    h1.innerText = title;
    h6.innerText = "العنوان:";
    h3.innerText = date;
    control.appendChild(h6);
    control.appendChild(h1);
    main.appendChild(control);
    main.appendChild(onlyReadArea);
    ending.appendChild(h3);
    main.appendChild(ending);
    main.appendChild(btns);
}

const LDSwitch = (isStored) => {
    const LD = document.querySelector("#LD > a");
    const h2 = document.querySelector("#LD > h2");
    if (document.querySelector('html').getAttribute('mode') == "light") {
        document.cookie = "mode=dark; path=/";
        h2.innerText = "مشرق";
        document.querySelector('html').setAttribute('mode', 'dark');
    } else {
        document.cookie = "mode=light; path=/";
        h2.innerText = "مظلم";
        document.querySelector('html').setAttribute('mode', 'light');
    }
}