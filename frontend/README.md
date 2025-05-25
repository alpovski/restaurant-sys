# Restoran Yönetim Sistemi - Frontend

Bu proje, restoran yönetim sisteminin frontend kısmını içerir. React ve TypeScript kullanılarak geliştirilmiştir.

## Özellikler

- Kullanıcı kimlik doğrulama (giriş/kayıt)
- Menü yönetimi
- Sipariş yönetimi
- Masa yönetimi
- Mutfak yönetimi
- Yönetici paneli

## Başlangıç

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/restaurant-system.git
cd restaurant-system/frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
# veya
yarn start
```

Uygulama http://localhost:3000 adresinde çalışmaya başlayacaktır.

## Kullanılan Teknolojiler

- React
- TypeScript
- Material-UI
- React Router
- Axios

## Proje Yapısı

```
src/
  ├── components/     # Yeniden kullanılabilir bileşenler
  ├── context/       # React context'leri
  ├── pages/         # Sayfa bileşenleri
  ├── services/      # API servisleri
  ├── types/         # TypeScript tip tanımlamaları
  ├── App.tsx        # Ana uygulama bileşeni
  └── index.tsx      # Uygulama giriş noktası
```

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Dalınıza push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
