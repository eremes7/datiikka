
const dummyKappaleet = [
  {
    'id': '1',
    'nimi': 'Olutkaanon',
    'alkuperäinen': 'Jaakko Kulta',
    'sanat': 'Lapin kulta, Lapin kulta\nKarjala, Karjala\nSininen ja Olvi, Sininen ja Olvi\nKoff, Koff, Koff',
    'kategoria': 'Juomalaulut'
  },
  {
    'id': '2',
    'nimi': 'Teekkarihymni',
    'sanat': 'Yö kuin kaamos pohjoisen on pimiä,\ntakajoukko nukkuu vain, nukkuu vain.\nTarhapöllön ääni kimiä,\nkuuluu pappilasta päin, kuuluu päin.\nJa taas ja siis ja\nyks, kaks, kolme, neljä, viis.',
    'kategoria': 'Kiltalaulut'
  },
  {
    'id': '3',
    'nimi': 'Jos ukkosi kieltää sua juomasta',
    'sanat': 'Jos eukkosi kieltää sua juomasta,\nJos eukkosi kieltää sua juomasta,\nNiin juo, niin juo.\nJos kieltää sua viinoja tuomasta,\nNiin tuo, niin tuo.\nMutt’ juomasta älä sinä milloinkaan lakkaa,\nVaan hanki sinä itselles’ parempi akka.\nJa juo ja laula, ja juo ja laula,\nJa juo ja laula, ja juo ja laula…\n\nUpseerit sotia taistelee,\nJa juo, ja juo,\nJa teltassa viinoja maistelee,\nJa juo, ja juo.\nKun taistelun melskeessä pyssyt ne paukkaa,\nNiin upseerit välillä pullosta naukkaa,\nJa juo ja laula, ja juo ja laula,\nJa juo ja laula, ja juo ja laula…\n\nMaisterit koulussa opettaa,\nJa juo, ja juo,\nJa illalla tuntinsa lopettaa,\nJa juo, ja juo.\nKun päivällä saksaa ja matikkaa jauhaa,\nNiin illalla raitilla RÄYHÄÄ JA PAUHAA!\nJa juo ja laula, ja juo ja laula,\nJa juo ja laula, ja juo ja laula…\n\nKun olutta paljon he juoneet on,\nHe on, he on,\nOn rakossa paino jo mahdoton,\nNiin on, niin on.\nNiin nestettä ulos tuli laskettavaksi,\nJa uutta voi naukata pullon tai kaksi,\nJa juo ja laula, ja juo ja laula,\nJa juo ja laula, ja juo ja laula…\n\nYhä seurassa veikot nuo maistelee,\nJa juo, ja juo,\nJa viime pullosta taistelee,\nJa juo, ja juo.\nKun baarissa viimein on tarjoilu loppu,\nOn päässäkin sammunut viimeinen proppu\nJa juo ja laula, ja juo ja laula,\nJa juo ja laula, ja juo ja laula…',
    'kategoria': 'Sitsilaulut'
  },
  {
    'id': '4',
    'nimi': 'Karhuviinaa & Savon Wiinaa',
    'alkuperäinen': 'Mörri-Möykky',
    'sanat': 'Ottaisin minä karhuviinaa jos vain pullon saisin\n:,: Pieneen kurkkuun kaataisin\nja sitten oksentaisin :,:\n\nTiu tau tiu tau tilitali tittan\nJuodaan rommia kolalla\n:,: Sitten kun ollaan koko pullo juotu\nollaan perseet olalla! :,:\n\nOttaisin minä Savon Wiinaa\njos vain jostain saisin\n:,: Koko pullon ryyppäisin\nja sitten oksentaisin :,:\n\nTiu tau tiu tau tilitali...\n\nEipä taida meidän äiti\nSavon Wiinaa ostaa\n:,: Eihän se edes usko että\nSavon Wiina on totta :,:\n\nTiu tau tiu tau tilitali...\n\nSyksyn tullen sieniä kasvaa\nvarpaanväleissämme\n:,: Eikä me sukkia vaihdeta\nei edes keskenämme :,:\n\nTiu tau tiu tau tilitali...',
    'kategoria': 'Juomalaulut'
  },
  {
    'id': '5',
    'nimi': 'Pieniä bittejä',
    'sanat': 'On pieniä bittejä,\nhelevetin pieniä bittejä. \nKun ne pannaan local busiin,\nsiellä ne saavat rauhassa…\nTaas on pieniä bittejä, HEI helevetin… \n(lauletaan niin monta kertaa, kuin korkea-arvoisin paikallaoleva Teekkari päättää)\nHalitulijullin julli, tsatsatsaa, pilipalipom tsatsatsaa\nåå… såå… svinger vi på seidelen igen – hej skål!',
    'kategoria': 'Kiltalaulut'
  },
  {
    'id': '6',
    'nimi': 'Internationalen',
    'sanat': 'Mera brännvin i glasen,\nmera glas på vårt bord,\nmera bord på kalasen,\nmer kalas på vår jord.\n\nMera jordar kring måne,\nmera måner till Mars,\nmera marscher till Skåne,\nmera Skåne, bevars, bevars, bevars!\n\nLisää viinaa mun lasiin,\nLisää laseja pöydälle.\nLisää pöytiä näihin juhliin,\nLisää juhlia kansalle.\n\nLisää kansaa Suomeen,\nLisää Suomea päälle maan.\nLisää maata Suomeen,\n',
    'kategoria': 'Sitsilaulut'
  },
  {
    'id': '7',
    'nimi': 'Maamme',
    'sanat': 'Oi maamme, Suomi, synnyinmaa\nSoi, sana kultainen!\nEi laaksoa, ei kukkulaa\nEi vettä rantaa rakkaampaa\nKuin kotimaa tää pohjoinen\nMaa kallis isien!\n\nSun kukoistukses kuorestaan\nKerrankin puhkeaa\nViel lempemme saa nousemaan\nSun toivos, riemus loistossaan\nJa kerran, laulus synnyinmaa\nKorkeemman kaiun saa',
    'kategoria': 'Isänmaa'
  },
  {
    'id': '8',
    'nimi': 'Finlandia',
    'sanat': 'Oi Suomi, katso, Sinun päiväs koittaa\nYön uhka karkoitettu on jo pois\nJa aamun kiuru kirkkaudessa soittaa\nKuin itse taivahan kansi sois\nYön vallat aamun valkeus jo voittaa\nSun päiväs koittaa, oi synnyinmaa',
    'kategoria': 'Isänmaa'
  },
  {
    'id': '9',
    'nimi': 'Lippulaulu',
    'sanat': 'Siniristilippumme,\nsulle käsin vannomme, sydämin:\nsinun puolestas elää ja kuolla\non halumme korkehin.\n\nKuin taivas ja hanki Suomen\novat värisi puhtahat.\nSinä hulmullas mielemme nostat\nja kotimme korotat.\n\nIsät, veljet verellään\nvihki sinut viiriksi vapaan maan.\nIlomiellä sun jäljessäs käymme\nteit\' isäin astumaan.\n\nSun on kunnias kunniamme,\nsinun voimasi voimamme on.\nSinun kanssasi onnemme jaamme\nja iskut kohtalon.\n\nSiniristilippumme,\nsulle valan vannomme   kallihin:\nsinun puolestas elää ja kuolla\non halumme korkehin.',
    'kategoria': 'Isänmaa'
  },
  {
    'id': '10',
    'nimi': 'Jääkärimarssi',
    'sanat': 'Syvä iskumme on, viha voittamaton,\nmeil\' armoa ei kotimaata.\nKoko onnemme kalpamme kärjessä on,\nei rintamme heltyä saata.\nSotahuutomme hurmaten maalle soi,\nmi katkovi kahleitansa.\nei ennen uhmamme uupua voi,\nkuin vapaa on Suomen kansa::\n\nKun painuvi päät muun kansan, maan,\nme jääkärit uskoimme yhä.\nOli rinnassa yö, tuhat tuskaa,\nvaan yks\' aatos ylpeä, pyhä:\nMe nousemme kostona Kullervon,\nsoma on sodan kohtalot koittaa.\nSatu uusi nyt Suomesta syntyvä on,\nse kasvaa, se ryntää, se voittaa::\n\nHäme, Karjala, Vienan rannat ja maa,\nyks\' suuri on Suomen valta.\nSen aatetta ei väkivoimat saa\npois Pohjolan taivaan alta.\nSen leijonalippua jääkärien\nkäsivarret jäntevät kantaa.\nYli pauhun kenttien hurmeisten\npäin nousevan Suomen rantaa::',
    'kategoria': 'Taistohon poijjat'
  },
  {
    'id': '11',
    'nimi': 'Sillanpään marssilaulu',
    'sanat': 'Kotikontujen tienoita tervehtien\nTämä laulumme kaikukoon\nYli peltojen, vetten ja tunturien\nAina Hangosta Petsamoon\n\nSama kaiku on askelten\nKyllä vaistomme tuntee sen\nKuinka kumpujen kätköistä, mullasta maan\nIsät katsovat poikiaan\n\nSinä tiedäthän veikko mun vierelläin\nMikä retkemme tänne toi\nIlomielin me riensimme sinnepäin\nMissä yhteinen kutsu soi\n\nTapa tuttu jo taattojen\nNyt on hoidossa poikasten:\nKun on vaaralle alttiina syntymämaa\nKotiaskaret jäädä saa\n\nMitä lieneekin aarteita Suomessa\nToki kallehin on vapaus\nTääll\' on suorana seistä ja kaatua\nJoka miehellä oikeus\n\nSiis te lapset ja vanhukset\nJa te äidit ja morsiamet\nNiin kauan teillä on suojattu lies\nKun on pystyssä yksikin mies',
    'kategoria': 'Taistohon poijjat'
  },
  {
    'id': '12',
    'nimi': 'Ässät korkealla',
    'sanat': 'Alkupuhe: “Me jatkamme, me jatkamme loppuun asti. Me taistelemme\nmaalla, ja me taistelemme merellä. Käymme ilmasotaa suurella\nitseluottamuksella, ja voimalla. Puolustamme maatamme, ja sitä\nmikä meidän on. Maksoi mitä maksoi. Taistelemme rannoilla ja\nvuorilla, pelloilla ja kaduilla. Ja me taistelemme rajoilla.\nMe emme koskaan antaudu.“\n\nSireenit huutaa, taas on ilmaisku\nIT jo jyskyttää suojatultaan\nKiireessä juoksemme lentokoneille\npakko päästä taivaalle torjumaan\nHyppää ohjaamoon ja käynnistä moottorit\nhelvettiin liukutuet, nyt on kiire\nKohti kiitorataa, vauhti kasvaa\nheti ilmaan tai aikamme täyttyy\n.:Juoskaa, koneeseen, ilmaan\nKierre, syöksy, tulta\nSama uudestaan:.\nHän elää lentääkseen, lentää elääkseen.\nOnnistuu tai kuolee. Päivästä päivään.\nElää lentääkseen, lentää eläkseen.\nÄssät korkealla.\n\nPommikoneiden pääaalto lähestyy\nvain lyhyt sarja ja heti sivuun\nTiukka silmukka ja oot aivan takana\nkulmasta kuolleesta lisää tulta\nRosvoja takana, kello kuudesta\nkymmenen mersua auringosta\nKäännän koneeni ja nousen ylemmäs\nlennän suoraan päin ja avaan tulen\n\n.:Juoskaa, koneeseen, ilmaan\nKierre, syöksy, tulta\nSama uudestaan:.\nHän elää lentääkseen, lentää elääkseen.\nOnnistuu tai kuolee. Päivästä päivään.\nElää lentääkseen, lentää eläkseen.\nÄssät korkealla.',
    'kategoria': 'Taistohon poijjat'
  }
]

module.exports = dummyKappaleet
