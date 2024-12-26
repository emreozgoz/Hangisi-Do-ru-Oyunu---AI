interface KelimeCifti {
  dogru: string;
  yanlis: string;
}

export function rastgeleKelimeGetir(kelimeler: KelimeCifti[]) {
  // Tüm diziyi karıştır ve rastgele bir kelime seç
  const karisikKelimeler = karistir([...kelimeler]);
  
  const kelime = karisikKelimeler[0];

  // Seçenekleri de karıştır
  const secenekler = karistir([kelime.dogru, kelime.yanlis]);
  
  return {
    secenekler,
    dogruCevapIndex: secenekler.indexOf(kelime.dogru),
    dogruYazim: kelime.dogru,
    yanlisYazim: kelime.yanlis
  };
}

// Daha iyi karıştırma algoritması
export function karistir<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = 
    [array[randomIndex], array[currentIndex]];
  }

  return array;
} 