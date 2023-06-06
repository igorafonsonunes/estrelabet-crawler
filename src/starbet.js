const axios = require("axios");

const getDataFromStartBet = async (name) => {
    let data = JSON.stringify({
        "requestBody": {
            "name": name,
            "bragiUrl": "https://bragi.sportingtech.com/"
        },
        "device": "d",
        "languageId": 12
    });

    let config = {
        method: 'post',
        url: `https://estrelabet.com/api-v2/name-search/d/12/estrelabet/${name}`,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Cookie': '_ga_JNY80EMZ8E=GS1.1.1685998262.3.0.1685998262.60.0.0; lang=es; NCC=PTB; __nxquid=/VOEORcKyJeH1djtKGUOC/07acnRWA==0014; __nxquid=THn4eRcKyJeH1djsKGWXC/07TTbRWA==0014',
            'DNT': '1',
            'Origin': 'https://estrelabet.com',
            'Referer': `https://estrelabet.com/es/bet/search/${name}`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            'bragiurl': 'https://bragi.sportingtech.com/',
            'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            return response.data.data[0];
        })
        .catch(function (error) {
            console.log(error);
        });
};

const createResponse = (match, dateMatch) => {
    return {
        "time": match.acN,
        "timeAdversario": match.hcN,
        "dataPartida": dateMatch.split(" ")[0],
        "horarioPartida": dateMatch.split(" ")[1],
        "oddVitoria": match.btgs[0].fos[2].hO,
        "oddEmpate": match.btgs[0].fos[1].hO,
        "oddDerrota": match.btgs[0].fos[0].hO,
    };
};

const findMatch = (matches) => {
    let index = 0;
    let dateMatch = null;

    for (let i = 0; i < matches.length; i++) {
        const timestamp = matches[i].fsd;
        const match = matches[i];
        if (dateMatch == null && match.ante == false) {
            dateMatch = new Date(timestamp).toLocaleString();
        } else if (dateMatch > (new Date(timestamp).toLocaleString()) && match.ante == false) {
            dateMatch = new Date(timestamp).toLocaleString();
            index = i;
        }
    }

    return [matches[index], dateMatch];
};

const getOnlyMatches = (data) => {
    const matches = data.cs.map(play => {
        if (play.cN.includes('Simulated Reality')) {
            return null;
        }
        else if (play.sns[0].sns !== undefined) {
            return play.sns[0].sns[0].fs[0];
        }
        return play.sns[0].fs[0]
    });

    return matches;
};

const getActualMatch = async (name) => {
    const data = await getDataFromStartBet(name);
    let response = "Nenhum resultado encontrado.";

    if (data) {
        const matches = getOnlyMatches(data);
        const [match, dateMatch] = findMatch(matches);

        response = createResponse(match, dateMatch);
    }

    console.log(response);
    return response;
};

module.exports = { getActualMatch };