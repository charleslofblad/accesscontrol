function exportToXML(data) {
    let root = xmlbuilder.create('arxdata', { version: '1.0', encoding: 'UTF-8' })
        .att('timestamp', new Date().toISOString());
    let persons = root.ele('persons');
    let cards = root.ele('cards');
    data.forEach(item => {
        let person = persons.ele('person');
        person.ele('id', item['Personnummer']);
        person.ele('first_name', item['FormatFornamn']);
        person.ele('last_name', item['FormatEfternamn']);
        person.ele('pin_code', item['PIN-kod']);

        let accessCategories = person.ele('access_categories');
        if (item['Behörighetskategori_1']) {
            let accessCategory1 = accessCategories.ele('access_category');
            accessCategory1.ele('name', item['Behörighetskategori_1']);
        }
        if (item['Behörighetskategori_2']) {
            let accessCategory2 = accessCategories.ele('access_category');
            accessCategory2.ele('name', item['Behörighetskategori_2']);
        }

        let card = cards.ele('card');
        card.ele('number', item['Mifare-kod']);
        card.ele('format_name', 'Mifare CSN');
        card.ele('person_id', item['Personnummer']);
        card.ele('description', 'Tjänstekort');
    });
    return formatXml(root.end({ pretty: true }));
}

function formatXml(xml) {
  let formatted = '';
  let reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    let padding = new Array(pad + 1).join('  ');
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

function xmlToJson(xml) {
  let json = {};
  xml2js.parseString(xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
    if (err) {
      throw err;
    }

    // Extrahera persons-data
    const persons = Array.isArray(result.arxdata.persons.person)
      ? result.arxdata.persons.person.map(person => ({
          Personnummer: person.id.replace('ID:', '').split('_')[1], // Extrahera ID
          Fornamn: person.first_name,
          Efternamn: person.last_name.split(', ')[1], // Ta bort företagsnamn
          Beskrivning: person.description,
          PINkod: person.pin_code,
          TillatLoggning: person.allow_logging,
          ArxGoAccess: person.arx_go_access,
          TwoStepVerificationType: person.two_step_verification_type,
          SpecialAccess: person.special_access,
          Behorighetskategori_1: person.access_categories.access_category
            ? person.access_categories.access_category.name
            : null
        }))
      : [];

    // Extrahera cards-data
    const cards = Array.isArray(result.arxdata.cards.card)
      ? result.arxdata.cards.card.map(card => ({
          Mifarekod: card.number,
          FormatNamn: card.format_name,
          Personnummer: card.person_id,
          Beskrivning: card.description
        }))
      : [];

    json = { persons, cards };
  });
  return json;
}