var indexOfType = "";
var typeOfPage = "";
var dropOpened = false;
const pages = [
    {
        form: `<label for="in1">العنوان</label>
        <input type="text" id="in1" name="title" required>
        <label for="f1" input>ادخل ملف الايقونة بصيغة SVG</label>
        <input type="file" name="f1" accept=".svg" id="f1" required miss>
        <label for="in2">النوع</label>
        <input type="text" id="in2" name="type" required>
        <label for="ta1">التفاصيل</label>
        <textarea id="ta1" name="description" required></textarea>`,
    },
    {
        form: `<label for="in1">العنوان</label>
        <input type="text" id="in1" name="title" required>
        <label for="f1" input> ادخل ملف الايقونة بصيغة SVG </label>
        <input type="file" accept=".svg" name="f1" id="f1" required miss>`,
    },
    {
        form: `<label for="in1">العنوان</label>
        <input type="text" id="in1" name="title" required>
        <label for="f1" input>ادخل مجلد الدرس</label>
        <input type="file" id="f1" webkitdirectory directory name="f1" required miss>`,
    }
];

const {log } = console;

window.onload = e => {
    document.querySelectorAll('header .btn')[0].click();
};
window.onscroll = e => {
    hideDialog();
}

const refresh = async (i) => {
    await fetch(`./getTableData?type=${i}`).then(v => v.json()).then(v => { if (v['values'].length > 0) {
        const keys = Object.keys(v['path']);
        document.getElementById('ths').innerHTML = "";
        document.getElementById('tds').innerHTML = "";
        [...keys, "edit"].forEach(e => {
            var th = document.createElement("th");
            th.innerText = String(e);
            document.getElementById('ths').appendChild(th);
        });
        v['values'].forEach(e => {
            var tr = document.createElement('tr');
            [ ...keys, "edit"].forEach(i => {
                if (i == "edit") {
                    var td = document.createElement('td');
                    td.id = "dropdown";
                    td.innerHTML = '<i class="fa fa-bars"></i>';
                    td.style.textAlign = "center";
                    td.onclick = () => {
                        if (td.innerHTML == '<i class="fa fa-bars"></i>') {
                            var div = document.createElement('div');
                            var a1 = document.createElement('li');
                            var a2 = document.createElement('li');
                            a1.innerText = "تحديث";
                            a1.onclick = () => showFormDialog(indexOfType, e);
                            a2.innerText = "حذف";
                            a2.onclick = () => showDeleteDialog(typeOfPage, e);
                            div.appendChild(a1);
                            div.appendChild(a2);
                            td.innerHTML = "";
                            td.appendChild(div);
                            dropOpened = true;
                        } else {
                            td.innerHTML = '<i class="fa fa-bars"></i>';
                        }
                    }
                    tr.appendChild(td);
                } else {
                    var td = document.createElement('td');
                    if (typeof e[i] == "string" || typeof e[i] == "number") td.innerText = e[i];
                    if (typeof e[i] == "object") {
                        var btn = document.createElement('button');
                        btn.innerText = 'تحرير عناصر المصفوفة';
                        td.style.textAlign = "center";
                        btn.onclick = event => showResortingDialog(e[i], e['_id']);
                        td.appendChild(btn);
                    };
                    tr.appendChild(td);
                }
            });
            document.getElementById('tds').appendChild(tr);
        });
        document.getElementById("wronging").classList.add('d-n');
    } else {
        document.getElementById('ths').innerHTML = "";
        document.getElementById('tds').innerHTML = "";
        document.getElementById("wronging").classList.remove('d-n');
    }});
};

const addToTable = async (i, t) => {
    typeOfPage = i;
    indexOfType = Array.prototype.indexOf.call(t.parentElement.children, t);
    document.querySelector('section input').value = "";
    document.querySelectorAll("body > header > div").forEach(e => {
        e.style.backgroundColor = "var(--bg2)";
        e.style.color = "white";
    });
    t.style.backgroundColor = "white";
    t.style.color = "var(--bg2)";
    refresh(i);
};

const search = () => {
    var text = document.querySelector('section input').value;
    if (document.getElementById('tds').innerHTML != "") {
        document.querySelectorAll("tr").forEach(tr => {
            var count = 0;
            tr.querySelectorAll('td').forEach(e => {
                if (e.innerText.includes(text)) {
                    count ++;
                }
            });
            if (count == 0) {
                tr.style.display = "none";
            } else {
                tr.style.display = "table-row";
            }
        })
    }
};

const showFormDialog = async (index, update) => {
    const dialog = document.getElementById('dialog');
    const divs = document.querySelectorAll('#dialog > div');
    const form = document.querySelector('#dialog form');
    form.innerHTML = pages[index].form;
    divs.forEach(e => e.style.display = "none");
    divs[0].style.display = "block";
    dialog.style.display = "flex";
    document.getElementById('f1').onchange = () => {
        if (document.getElementById('f1').files.length == 0) {
            document.querySelector('label[for=f1]').style.backgroundColor = "red";
        } else {
            document.querySelector('label[for=f1]').style.backgroundColor = "transparent";
        }
    }
    if (update) {
        document.getElementById('f1').setAttribute("isEmpty", true);
        document.querySelector('label[for=f1]').style.backgroundColor = "transparent";
        document.getElementById('f1').onchange = () => {
            document.getElementById('f1').removeAttribute("isEmpty");
            document.querySelector('label[for=f1]').style.backgroundColor = "gray";
        };
        document.querySelectorAll('#d-fotm input[name] ,#d-fotm textarea[name]').forEach(e => {
            if (e.type != "file") e.value = update[e.getAttribute('name')];
        });
        document.getElementById('f1').removeAttribute('required');
    }

    divs[0].querySelector('#btn1').onclick = async () => {
        if (form.checkValidity()) {
            var formData = new FormData(form);
            formData.append("indexOfType", indexOfType);
            formData.append("typeOfPage", typeOfPage);
            if (update) {
                if (document.getElementById('f1').hasAttribute("isEmpty")) {
                    formData.set('f1', '404');
                }
                formData.set('id', update._id);
            }
            await fetch(`form?type=${indexOfType}`, {
                method: update? "PUT": "POST",
                body: formData
            }).then(v => v.text()).then( v => {
                refresh(typeOfPage);
                hideDialog();
            });
        } else {
            if ((!update) && (document.getElementById('f1').files.length == 0)) {
                document.getElementById('f1').focus();
                document.getElementById('f1').click();
            }
            if (update) {
                form.reportValidity();
            }
        }
    };
}

const showDeleteDialog = (type, {_id}) => {
    const dialog = document.getElementById('dialog');
    const divs = document.querySelectorAll('#dialog > div');
    divs.forEach(e => e.style.display = "none");
    divs[1].style.display = "block";
    dialog.style.display = "flex";
    divs[1].querySelector('#btn1').onclick = async (e) => {
        await fetch(`./form?type=${type}&id=${_id}`, {method: "delete"}).then(v => v.text()).then(v => {
        console.log(v);
        hideDialog();
        refresh(typeOfPage);
    });
    };
}; 

const showResortingDialog = async (Array, id) => {
    const dialog = document.getElementById('dialog');
    const divs = document.querySelectorAll('#dialog > div');
    const resorter = document.getElementById('resorter');
    const save = document.querySelector('#dialog > div #save');
    const add = document.querySelector('#dialog > div #add');
    divs.forEach(e => e.style.display = "none");
    divs[2].style.display = "block";
    dialog.style.display = "flex";
    resorter.innerHTML = "";
    add.onclick = e => {
        var result = [];
        document.querySelectorAll('#resorter > li').forEach( v => {
            result.push({
                id: v.getAttribute("data-id"),
                type: v.getAttribute("data-Ctype")
            });
        });
        showinserterResortingDialog(result, id);
    };
    save.style.display = "none";
    if (Array.length == 0) {
        resorter.innerHTML = "<p> لا يوجد دروس لتعيينها </p>";
    } else {
        var data = {
            array: Array,
            type: typeOfPage
        };
        await fetch('./fetchupdatearray', {method: 'put' ,headers: {'Content-Type': "application/json"}, body: JSON.stringify(data)})
        .then(v => v.json())
        .then(arr => {
            save.style.display = "block";
            if (arr.length > 1) new Sortable(resorter, {
                animation: 200,
            });
            if (arr.length != Array.length) {
                refresh(typeOfPage);
                hideDialog();
                alert("كانت هناك مشكلة في صحة البيانات المجلوبة، حاول مجدداََ.");

            }
                arr.forEach(async (v, i) => {
                    var li = document.createElement('li');
                    var x = document.createElement('i');
                    x.className = "fa fa-x";
                    li.innerHTML = `<h5> ${v.Ctype == "Li"? "قائمة" : "درس"} </h5>`;
                    li.innerHTML += `<div> ${v.title} ${v.icon? "<br/>" + v.icon: ""} <div/>`;
                    li.appendChild(x);
                    li.setAttribute("data-id", v._id);
                    li.setAttribute("data-Ctype", v.Ctype);
                    if (v.Ctype == "Li") li.classList.add("list");
                    x.onclick = e => li.remove();
                    resorter.appendChild(li);
                });
        });
    }
    save.onclick = async e => {
        var result = [];
        document.querySelectorAll('#resorter > li').forEach( v => {
            result.push({
                id: v.getAttribute("data-id"),
                type: v.getAttribute("data-Ctype")
            });
        });
        var data = JSON.stringify({
            type: typeOfPage,
            result, id
        })
        await fetch('./updatearray', {method: 'put' ,headers: {'Content-Type': "application/json"}, body: data}).then(v => v.text()).then(v => {
            refresh(typeOfPage);
            hideDialog();
        });
        };
}

const showinserterResortingDialog = async (Array, id) => {
    hideDialog();
    const dialog = document.getElementById('dialog');
    const divs = document.querySelectorAll('#dialog > div');
    const add = document.getElementById('addItem');
    divs.forEach(e => e.style.display = "none");
    divs[3].style.display = "block";
    dialog.style.display = "flex";
    add.style.display = "none";
    var data = {
        type: typeOfPage,
        id
    };
    await fetch("addarray", {method: 'put' ,headers: {'Content-Type': "application/json"}, body: JSON.stringify(data)}).then(v => v.json()).then(v => {
        document.getElementById('addItems').innerHTML = "";
        v.forEach(vl => {
            if (vl.values) vl.values.forEach(e => {
                if (true) {
                    var count = 0;
                    var li = document.createElement("li");
                    var inp = document.createElement("input");
                    var h3 = document.createElement("h3");
                    li.setAttribute('_id', e["_id"]);
                    li.setAttribute('type', vl["type"]);
                    inp.oninput = e => {
                        e.preventDefault();
                        var thereIsChecked = false;
                        divs[3].querySelectorAll('li input').forEach(e => {
                            thereIsChecked = thereIsChecked || e.checked;
                        });
                        add.style.display = thereIsChecked? "block": "none";
                    }
                    add.onclick = e => {
                        divs[3].querySelectorAll('li').forEach(e => {
                            if (e.querySelector('input').checked) Array.push({
                                id: e.getAttribute('_id'),
                                type: e.getAttribute('type'),
                            });
                        });
                        log(Array)
                        showResortingDialog(Array, id);
                    }
                    li.onclick = e => {
                        inp.click();
                    }
                    inp.type = "checkbox";
                    h3.innerHTML = e["title"] + (vl["type"] == "Le"? "  <b>درس</b>": "  <b>قائمة</b>");
                    li.appendChild(inp);
                    li.appendChild(h3);
                    document.getElementById('addItems').appendChild(li);
                }
            });
        });
        if (!document.getElementById('addItems').children.length) {
            document.getElementById('addItems').innerHTML = "<p> لا يوجد عناصر لاضافتها </p>";
        }
    });
}

const hideDialog = () => {
    document.getElementById('dialog').style.display = "none";
}