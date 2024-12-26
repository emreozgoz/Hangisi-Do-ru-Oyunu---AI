import React, { useState, useEffect } from 'react';
import './App.css';
import kelimeler from './data/kelimeler.json';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [tumKelimeler, setTumKelimeler] = useState([...kelimeler.kelimeCiftleri]);
  const [oyunBasladi, setOyunBasladi] = useState(false);
  const [kalanCan, setKalanCan] = useState(3);
  const [kalanSure, setKalanSure] = useState(30);
  const [dogruCevaplar, setDogruCevaplar] = useState([]);
  const [yanlisCevaplar, setYanlisCevaplar] = useState([]);
  const [showSonuc, setShowSonuc] = useState(false);

  // Fisher-Yates karıştırma algoritması
  const karistir = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = 
      [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const rastgeleKelimeGetir = (kelimeler) => {
    const karisikKelimeler = karistir([...kelimeler]);
    const kelime = karisikKelimeler[0];
    const secenekler = karistir([kelime.dogru, kelime.yanlis]);
    
    return {
      secenekler,
      dogruCevapIndex: secenekler.indexOf(kelime.dogru),
      dogruYazim: kelime.dogru,
      yanlisYazim: kelime.yanlis
    };
  };

  const yeniOyunBaslat = () => {
    setKalanCan(3);
    setKalanSure(30);
    setDogruCevaplar([]);
    setYanlisCevaplar([]);
    setShowSonuc(false);
    const karisikKelimeler = karistir([...kelimeler.kelimeCiftleri]);
    setTumKelimeler(karisikKelimeler);
    setOyunBasladi(true);
    
    const ilkSoru = rastgeleKelimeGetir(karisikKelimeler);
    setCurrentQuestion(ilkSoru);
  };

  const yeniSoruGetir = () => {
    if (tumKelimeler.length <= 1) {
      const yeniKelimeler = karistir([...kelimeler.kelimeCiftleri]);
      setTumKelimeler(yeniKelimeler);
    }

    const yeniSoru = rastgeleKelimeGetir(tumKelimeler);
    
    setTumKelimeler(prev => prev.filter(k => 
      k.dogru !== yeniSoru.dogruYazim && k.yanlis !== yeniSoru.yanlisYazim
    ));

    setCurrentQuestion(yeniSoru);
  };

  const cevapKontrol = (secilenIndex) => {
    if (!currentQuestion) return;

    if (secilenIndex === currentQuestion.dogruCevapIndex) {
      setDogruCevaplar([...dogruCevaplar, currentQuestion.dogruYazim]);
      yeniSoruGetir();
    } else {
      setYanlisCevaplar([...yanlisCevaplar, {
        dogru: currentQuestion.dogruYazim,
        yanlis: currentQuestion.yanlisYazim
      }]);
      
      const yeniKalanCan = kalanCan - 1;
      setKalanCan(yeniKalanCan);
      
      if (yeniKalanCan === 0) {
        setShowSonuc(true);
        setOyunBasladi(false);
        return;
      }
      yeniSoruGetir();
    }
  };

  useEffect(() => {
    let timer;
    if (oyunBasladi && kalanSure > 0) {
      timer = setInterval(() => {
        setKalanSure(prev => prev - 1);
      }, 1000);
    } else if (kalanSure === 0 && oyunBasladi) {
      setOyunBasladi(false);
      setShowSonuc(true);
    }
    return () => clearInterval(timer);
  }, [kalanSure, oyunBasladi]);

  useEffect(() => {
    yeniOyunBaslat();
  }, []);

  if (!currentQuestion) return <div>Yükleniyor...</div>;

  return (
    <div className="App">
      {showSonuc ? (
        <div className="sonuc-popup">
          <h2>Oyun Bitti!</h2>
          <div className="toplam-skor">
            <div className="skor-item dogru">
              <span className="skor-sayi">{dogruCevaplar.length}</span>
              <span className="skor-metin">Doğru</span>
            </div>
            <div className="skor-item yanlis">
              <span className="skor-sayi">{yanlisCevaplar.length}</span>
              <span className="skor-metin">Yanlış</span>
            </div>
          </div>
          <div className="skor-ozeti">
            <h3>Doğru Bildikleriniz:</h3>
            <div className="dogru-cevaplar">
              {dogruCevaplar.map((cevap, index) => (
                <div key={index} className="cevap dogru">
                  {cevap}
                </div>
              ))}
            </div>
            
            <h3>Yanlış Bildikleriniz:</h3>
            <div className="yanlis-cevaplar">
              {yanlisCevaplar.map((cevap, index) => (
                <div key={index} className="cevap yanlis">
                  <span className="yanlis-yazim">{cevap.yanlis}</span>
                  <span className="ok">➜</span>
                  <span className="dogru-yazim">{cevap.dogru}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={yeniOyunBaslat} className="yeniden-oyna">
            Yeniden Oyna
          </button>
        </div>
      ) : (
        <>
          <h2>Hangisi Doğru?</h2>
          <div className="sure">Kalan Süre: {kalanSure}</div>
          <div className="kalan-can">
            {[...Array(3)].map((_, index) => (
              <span key={index} className="kalp">
                {index < kalanCan ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <div className="buttons">
            {currentQuestion?.secenekler.map((secenek, index) => (
              <button
                key={index}
                onClick={() => cevapKontrol(index)}
                className="option-button"
              >
                {secenek}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App; 