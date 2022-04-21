"use strict";
//@ts-check 
// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//


console.log(data);
// Ollaan hököllä jäsen inputtien määrästä
var jasenInputit = [];
// muokattavissa oleva joukkue
var valittu_joukkue;

window.onload = function() {
    // piste sarake tässä jotta se tehdään vain kerran
    let tr = document.getElementsByTagName("tr");
    let th = document.createElement("th");
    th.textContent = "Pisteet";
    tr[0].appendChild(th);

    rastiObjektit();
    laskePisteet();
    data.joukkueet.sort(compare);
    tulostaJoukkueet(data.joukkueet);
    uusiRasti(data.rastit);
    let nappi = document.getElementById("rasti");
    // rastin lisäys tapahtuma
    nappi.addEventListener("click", lisaaRasti);
    let nappi2 = document.getElementsByName("muokkaa");
    // joukkueen muokkaus tapahtuma
    nappi2[0].addEventListener("click", function(e) {
        e.preventDefault();
        muokkaa(valittu_joukkue);
    });
    nappi2[0].style.display = "none";
    let nappi1 = document.getElementsByName("joukkue");
    // joukkueen lisäys tapahtuma
    nappi1[0].addEventListener("click", lisaaJoukkue);
    joukkueForm();
    // lisätään heti alkuun oikea määrä jäsen inputteja
    jasenInputLisays(2, jasenInputit);

    let field = document.getElementById("field1");
    let inputit = field.getElementsByTagName("input");

    inputit[0].addEventListener("keyup", function() { 
        tarkistaNappi(); 
    });

    otsikot_linkeiksi();

    let a1 = document.getElementById("pisteet");
    a1.addEventListener("click", function() {
        data.joukkueet.sort(vertaa_points);
        tulostaJoukkueet(data.joukkueet);
    });

    let a2 = document.getElementById("joukkue");
    a2.addEventListener("click", function() {
        data.joukkueet.sort(vertaa_joukkueet);
        tulostaJoukkueet(data.joukkueet);
    });

    let a3 = document.getElementById("sarja");
    a3.addEventListener("click", function() {
        data.joukkueet.sort(compare);
        tulostaJoukkueet(data.joukkueet);
    });
};

/**
 * Järjestetään listaus pisteiden mukaan (taso 5)
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function vertaa_points(a,b) {
    
    let p1 = a.pisteet;
    let p2 = b.pisteet;

    if (p1 < p2) {
        return 1;
    }
    if (p1 > p2) {
        return -1;
    }
    taulukonTyhjennys();
}

/**
 * Järjestetään joukkueen nimen mukaan (taso 5)
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function vertaa_joukkueet(a,b) {
    
    taulukonTyhjennys();
    let j1 = a.nimi.toUpperCase().trim();
    let j2 = b.nimi.toUpperCase().trim();
    if (j1 > j2) {
        return 1;
    }
    if (j1 < j2) {
        return -1;
    }
}

/**
 * Joukkueen muokkaus
 * @param {*} joukkue muokattavissa oleva joukkue 
 * @returns 
 */
function muokkaa(joukkue) {
    if (!joukkue) {
        return;
    }
    let joukkueLomake = document.getElementById("joukkuelomake");
    let inputs = joukkueLomake.getElementsByTagName("input");

    if (inputs[0].value.trim() === "" || inputs[1].value.trim() === "" || inputs[2].value.trim() == "") {
        // Jos tyhjentää kaikki muokkauksen aikana, niin laitetaan valitun joukkkueen nimi input elementtiin ettei vain unohda joukkueensa nimeä (Jos ei joukkueen nimeä haluakkaan vaihtaa, käyttäjä on vahingossa tyhjentänyt kaikki ja on dementikko)
        inputs[0].value = joukkue.nimi;
        return;
    }

    joukkue.nimi = inputs[0].value;
    inputs[0].value = "";
    
    let uudetJasenet = [];
    for (let i = 1; i < inputs.length-1; i++) {
        const element = inputs[i].value;
        uudetJasenet.push(element);
        inputs[i].value = "";   
    }
    joukkue.jasenet = uudetJasenet;

    // Poistetaan turhat kentät
    poistaYlimaaraset();

    let legend = joukkueLomake.getElementsByTagName("legend");
    legend[0].textContent = "Uusi joukkue";
    let nappi = joukkueLomake.getElementsByTagName("button");
    nappi[0].style.display = "block";
    nappi[1].style.display = "none";

    taulukonTyhjennys();
    tulostaJoukkueet(data.joukkueet);
}


/**
 * "Päivittää" taulun
 */
function taulukonTyhjennys() {
    let table = document.getElementsByTagName("table")[0];
    let tablerows = table.getElementsByTagName("tr");
    for (let i = 1; i < tablerows.length; i++) {
        let row = tablerows[i];
        if (row.firstChild) {
        row.removeChild(row.firstChild);
        row.removeChild(row.firstChild);
        row.removeChild(row.firstChild);
        }
        
    }
    for (let i = tablerows.length-1; i >= 1; i--) {
        let row = tablerows[i];
        if (row) {
            table.removeChild(row);
        }
    }
}

/**
 * Järjestää listauksen sarjan, nimen ja pisteiden mukaan
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function compare(a,b) {
    taulukonTyhjennys();
    let sarja1 = a.sarja;
    let sarja2 = b.sarja;
    let joukkue1 = a.nimi.toUpperCase().trim();
    let joukkue2 = b.nimi.toUpperCase().trim();
    let point1 = a.pisteet;
    let point2 = b.pisteet;
    let sarjoja = data.sarjat;

    for (let i = 0; i < sarjoja.length; i++) {
        if (sarja1 == sarjoja[i].id) {
            sarja1 = sarjoja[i].nimi;
        }
        if (sarja2 == sarjoja[i].id) {
            sarja2 = sarjoja[i].nimi;
        }

    }
    if (sarja1 > sarja2) {return 1;}
    if (sarja1 < sarja2) {return -1;}
    if(point1 < point2) {return 1;}
    if(point1 > point2) {return -1;}
    if (joukkue1 > joukkue2) {return 1;}
    if (joukkue1 < joukkue2) {return -1;}
}

/**
 * tulostaa joukkue taulukon
 * @param {*} joukkue 
 */
function tulostaJoukkueet(joukkue) {
    //data.joukkueet.sort(compare);
    let table = document.getElementsByTagName("table");

    for (let i = 0; i < joukkue.length; i++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let a = document.createElement("a");
        let br = document.createElement('br');
        a.setAttribute("href", "#joukkuelomake");
        a.setAttribute("id",i);
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        td.textContent = sarja(joukkue[i].sarja);
        a.textContent = joukkue[i].nimi;
        table[0].appendChild(tr);
        tr.appendChild(td);
        tr.appendChild(td1);
        td1.appendChild(a);
        td1.appendChild(br);
        a.addEventListener("click", joukkueenTiedot);
        let jasenet = joukkue[i].jasenet;
        for (let k = 0; k < jasenet.length; k++) {
            if (k < jasenet.length-1) {
                let txt = document.createTextNode(jasenet[k] + ", ");
                td1.appendChild(txt);
            }
            else {
                let txt = document.createTextNode(jasenet[k]);
                td1.appendChild(txt);
            }
        }
        tr.appendChild(td2);
        td2.textContent = joukkue[i].pisteet + " p"; 
    }
}

/**
 * poistaa aina viimeisen jäseninputin
 * @param {*} taulu taulukko jäseninputeista
 */
function poistaViimeinenJasenInput(taulu) {
    let jasenetFieldSet = document.getElementById("field1"); 
    let jasenetp = jasenetFieldSet.getElementsByTagName("p");

    jasenetp[jasenetp.length-1].remove();
    taulu.pop();
}

/**
 * Kun klikataan taulukon a-elementtiä joukkueen tiedot tulee formiin
 * @param {*} e tapahtuman lähde
 */
function joukkueenTiedot(e) {
    // Alla oleva kommenteissa koska muuten linkki ei vie näkymää formiin
    //e.preventDefault();
    
    poistaYlimaaraset();

    let napit = document.getElementsByTagName("button");
    napit[napit.length-1].style.display = "block";
    napit[napit.length-2].style.display = "none";
    let i = e.target.getAttribute("id");

    let joukkueLomake = document.getElementById("joukkuelomake");
    
    let legend = joukkueLomake.getElementsByTagName("legend");
    legend[0].textContent = "Tallenna muutokset";

    let joukkue = data.joukkueet[i];
    let input = joukkueLomake.getElementsByTagName("input");
    input[0].value = joukkue.nimi;
    let field = document.getElementById("field1");
    let inputit = field.getElementsByTagName("input");
    inputit[0].value = joukkue.jasenet[0];
    inputit[1].value = joukkue.jasenet[1];

    if (inputit[1].value === "undefined") {
        inputit[1].value = "";
    }
    
    // lisätään aina yksi ylimääräinen input että on tilaa aina VIELÄ yhdelle jäsenelle
    for (let j = 2; j < joukkue.jasenet.length+1; j++) {
        jasenInputLisays(1,jasenInputit);
        if (j !== joukkue.jasenet.length) {
            inputit[j].value = joukkue.jasenet[j];
        }
        
    }
    valittu_joukkue = joukkue;
    
}


/**
 * Input tapahtuma
 * @param {*} jasenInputit 
 * @returns 
 */
function jasentenpaivitys(jasenInputit) {
    
    for (let i = 0; i < jasenInputit.length; i++) {
        const element = jasenInputit[i];
        if (element.value === "") {
           
            let viimeinen = jasenInputit[jasenInputit.length-1];
            if(viimeinen.value === "" && element !== viimeinen && jasenInputit.length > 2) {
                poistaViimeinenJasenInput(jasenInputit);
                return;
            }
            return;
        }
    } 
    jasenInputLisays(1,jasenInputit);
}


/**
 * Lisätään inputteja oikea määrä
 * @param {*} maara 
 * @param {*} jasenInputit 
 */
function jasenInputLisays(maara, jasenInputit) {
    for (let i = 1; i <= maara; i++) {
        let jasen1 = document.createElement("input");
        jasen1.setAttribute("type", "text");
        jasen1.setAttribute("value","");
    
        jasenInputit.push(jasen1);
      
        let pjasen1 = document.createElement("p");
        let labeljasen1 = document.createElement("label");
        let jasennro = document.createTextNode("Jäsen " + jasenInputit.length + " ");
    
        labeljasen1.appendChild(jasennro);
        labeljasen1.appendChild(jasen1);
        pjasen1.appendChild(labeljasen1);
    
        let jasenetFieldSet = document.getElementById("field1");
        jasenetFieldSet.appendChild(pjasen1);
       
    }

    jasenInputit.forEach(element => {
        element.addEventListener("keyup", function() {jasentenpaivitys(jasenInputit); tarkistaNappi();});
    });
}


/**
 * Etsiotään sarjan koodi
 * @param {*} sarjakoodi 
 * @returns 
 */
function sarja(sarjakoodi) {
    for (let i = 0; i < data.sarjat.length; i++) {
        if (sarjakoodi == data.sarjat[i].id) {
            return data.sarjat[i].nimi;
        }
    }
}

/**
 * Lisätään rastilomake
 * @param {*} rastit 
 */
function uusiRasti(rastit) {
    let form = document.getElementsByTagName("form");
    let field = document.createElement("fieldset");
    let legend = document.createElement("legend");
    form[0].appendChild(field);
    legend.textContent = "Rastin tiedot";
    field.appendChild(legend);
    let label = document.createElement("label");
    let input = document.createElement("input");
    let span = document.createElement("span");
    input.setAttribute("type", "text");
    input.setAttribute("value", "");
    span.textContent = "Lat";
    field.appendChild(label);
    label.appendChild(span);
    label.appendChild(input);

    let label1 = document.createElement("label");
    let input1 = document.createElement("input");
    let span1 = document.createElement("span");
    input1.setAttribute("type", "text");
    input1.setAttribute("value", "");
    span1.textContent = "Lon";
    field.appendChild(label1);
    label1.appendChild(span1);
    label1.appendChild(input1);

    let label2 = document.createElement("label");
    let input2 = document.createElement("input");
    let span2 = document.createElement("span");
    input2.setAttribute("type", "text");
    input2.setAttribute("value", "");
    span2.textContent = "Koodi";
    field.appendChild(label2);
    label2.appendChild(span2);
    label2.appendChild(input2);

    let button = document.createElement("button");
    button.setAttribute("id", "rasti");
    button.textContent = "Lisää rasti";
    field.appendChild(button);
}

/**
 * Lisätään uusi rasti dataan
 * @param {*} e tapahtuma
 */
function lisaaRasti(e) {
    e.preventDefault();
    let form = document.getElementsByTagName("form");
    let inputit = document.getElementsByTagName("input");

    let lat = inputit[0].value;
    let lon = inputit[1].value;
    let koodi = inputit[2].value;

    if (isNaN(lat) || isNaN(lon)) {
        return;
    }

    if (lat != "" && lon != "" && koodi != "") {
        let rasti = {
            "lon": lon,
            "koodi": koodi,
            "lat": lat,
            "id": suurinID(data)
        };
        data.rastit[data.rastit.length] = rasti;
        data.rastit.sort(vertaaRastit);
        tulostaRastit(data);
        form[0].reset();

    }
}

/**
* Etsii suurimman luvun
* @param {*} data data josta lukua haetaan
*/
function suurinID(data) {
    let sid = 0;
    let ras = data.rastit;
    for (let i = 0; i < ras.length; i++) {
        if (ras[i].id > sid) {
            sid = ras[i].id;
        }
    }
    return sid+1;
}

/**
 * Tulostaa rastit consoliin kun uusi rasti on lisätty
 * @param {*} data käytettävä data
 */
 function tulostaRastit(data) {
    let datar = data.rastit;
    
    console.log("Rasti          " + "Lat          " + "Lon");
    for (let i = 0; i < datar.length; i++) {
        let s = "";
        let rasti = datar[i].koodi;
        let lat = datar[i].lat;
        let lon = datar[i].lon;
        
        if (lat.length < 9) {
            let ero = 9 - lat.length;
            lat += " ".repeat(ero);
        }

        s += rasti + "             " + lat + "    " + lon;
        console.log(s);
    }
}

/**
 * Vertailu funktio rasteille
 * @param {*} a Vertailtava objekti
 * @param {*} b Vertailtava objekti
 */
 function vertaaRastit(a,b) {
    const rasti1 = a.koodi.toUpperCase().trim();
    const rasti2 = b.koodi.toUpperCase().trim();
  
    if (rasti1 < rasti2) {
        return -1;
    } else if (rasti1 > rasti2) {
        return 1;
    }
}

/**
 * Lasketaan joukkueille pisteet
 */
 function laskePisteet() {
    let d = data.joukkueet;
    let tulos = 0;
    for (let i = 0; i < d.length; i++) {
        let setti = new Set();
        for (let j = 0; j < d[i].rastit.length; j++) {
            if (d[i].rastit[j].rasti == undefined) {
                continue;
            }
            let pojot = d[i].rastit[j].rasti.koodi;
            if (pojot == undefined) {
                continue;
            }
            if (pojot != "LAHTO" || pojot !== "MAALI" || pojot !== "F" ) {
                setti.add(pojot);
            } 
        }
                 
        for (let k of setti) {
            if (k[0] <= "9" && k[0] >= "0") {
                let t = parseInt(k[0]);
                tulos += t;
            }
        }
        d[i].pisteet = tulos;
        tulos = 0;
    }
}


function rastiObjektit() {
    for (let i = 0; i < data.joukkueet.length; i++) {
        for (let j = 0; j < data.joukkueet[i].rastit.length; j++) {
            //console.log(data.joukkueet[i].rastit[j].rasti);
            for (let k = 0; k < data.rastit.length; k++) {
                if (data.joukkueet[i].rastit[j].rasti == data.rastit[k].id) {
                    data.joukkueet[i].rastit[j].rasti = data.rastit[k];
                }
            }
        }
    }
}

function joukkueForm() {
    let form = document.getElementById("joukkuelomake");
    let field = document.createElement("fieldset");
    field.setAttribute("id", "field1");
    let leg = document.createElement("legend");
    leg.textContent = "Jäsenet";
    let taul = form.childNodes;

    taul[1].insertBefore(field,taul[1].children[2]);
    field.appendChild(leg);
    
}


/**
 * Tarkistaa onko lisää joukkue nappi disabloitu, silloin kun pitää olla
 */
function tarkistaNappi() {
    let joukkueLomake = document.getElementById("joukkuelomake");
    let nappi = joukkueLomake.getElementsByTagName("button");
    let inputit = joukkueLomake.getElementsByTagName("input");
    if (inputit[0].value !== "" && inputit[1].value !== "" && inputit[2].value !== "") {
        nappi[0].disabled = false;
    } else {
        nappi[0].disabled = true;
    }
}

/**
 * Lisää joukkueen jos ehdot täyttyvät ja "päivittää" listauksen
 * @param {*} e tapahtuma
 */
 function lisaaJoukkue(e) {
    e.preventDefault();

    let joukkue = {
        "nimi":joukkueenNimi(),
        "id": uusId(),
        "jasenet": lisaaJasenet(),
        "leimaustapa": leimausTavat(),
        "rastit": [

        ],
        "sarja": joukkueenSarja()
        
    };

    if (joukkue.nimi !== "" && joukkue.jasenet.length >= 2) {
        let paikka = data.joukkueet.length;
        data["joukkueet"][paikka] = joukkue;
        document.getElementById("joukkuelomake").reset();
        let table = document.getElementsByTagName("table");
        let myTable = table[0];
        let rowCount = myTable.rows.length;
        for (let x = rowCount-1; x > 0; x--) {
            myTable.deleteRow(x);
        }
        poistaYlimaaraset();
        laskePisteet();
        data.joukkueet.sort(compare);
        tulostaJoukkueet(data.joukkueet);
    }
}

/**
 * Palauttaa input kenttään laitetun joukkueen nimen
 */
 function joukkueenNimi() {
    let field = document.getElementsByTagName("fieldset");
    let inp = field[1].getElementsByTagName("input");
    return inp[0].value;
}

/**
 * Palauttaa taulukon jäsenistä joukkueen lisäyksessä
 */
function lisaaJasenet() {
    let taul = [];
    let field = document.getElementById("field1");
    let inputit = field.getElementsByTagName("input");
    for (let i = 0; i < inputit.length; i++) {
        if (inputit[i].value.trim() !== "") {
            taul.push(inputit[i].value);
        }
    }
    return taul;
}

/**
 * palauttaa taulukon leimaustavoista joukkueen lisäyksessä
 */
function leimausTavat() {
    let taul = [];
    let leima = "GPS";
    for (let i = 0; i < data.leimaustavat.length; i++) {
        if (leima === data.leimaustavat[i]) {
            taul.push(i);
        }
    }
    return taul;
}

/**
 * Palauttaa sarjan id:n joukkueen lisäyksessä (aina 8h sarja)
 */
function joukkueenSarja() {
    let datas = data.sarjat;
    return datas[2].id;
}

/**
 * Palauttaa lisätylle joukkueelle id:n, yhtä suurempi kuin suurin id
 */
function uusId() {
    let id = 0;
    let dataj = data.joukkueet;
    for (let i = 0; i < dataj.length; i++) {
        if (dataj[i].id > id) {
            id = dataj[i].id;
        }
    }
    return id+1;
}


function poistaYlimaaraset() {
    if (jasenInputit.length > 2) {
        while(jasenInputit.length > 2) {
            poistaViimeinenJasenInput(jasenInputit);
        }
    }
}

/**
 * Muutetaan listauksen otsikot linkeiksi
 */
function otsikot_linkeiksi() {
    let th = document.getElementsByTagName("th");
    for (let i = 0; i < th.length; i++) {
        let a = document.createElement("a");
        a.textContent = th[i].textContent;
        a.href = "#"+th[i].textContent;
        a.id = th[i].textContent.toLowerCase();
        th[i].textContent = "";
        th[i].appendChild(a);
    } 
}