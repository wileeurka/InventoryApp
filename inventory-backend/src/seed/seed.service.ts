import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

const SEED_PRODUCTS = [
  { name: 'Vegafina Forteneza2 - Robusto', code: 'VF-001', flavor: 'Vanilla', description: 'Dominikański cygaro średniej mocy z kremowymi nutami wanilii. Liść okrywy Connecticut.' },
  { name: 'Cohiba Siglo VI', code: 'CO-001', flavor: 'Natural', description: 'Jedno z najbardziej prestiżowych cygar kubańskich. Nadzwyczajna złożoność i pełnia smaku.' },
  { name: 'Montecristo No. 2', code: 'MC-002', flavor: 'Maduro', description: 'Klasyczny kształt torpedo. Bogaty, ziemisty smak z nutami czekolady i kawy.' },
  { name: 'Romeo y Julieta Churchill', code: 'RJ-001', flavor: 'Connecticut', description: 'Ulubione cygaro Winstona Churchilla. Kremowe, łagodne z nutami orzechów.' },
  { name: 'Partagas Serie D No. 4', code: 'PD-004', flavor: 'Natural', description: 'Mocne, pełnosmakowe cygaro kubańskie. Nuty pieprzu i cedru.' },
  { name: 'Bolivar Royal Coronas', code: 'BO-001', flavor: 'Habano', description: 'Intensywne i aromatyczne. Jeden z najmocniejszych profili wśród kubańskich cygar.' },
  { name: 'H. Upmann Magnum 54', code: 'HU-001', flavor: 'Natural', description: 'Eleganckie cygaro o kremowej konsystencji. Nuty lnu, orzeszków i słodkiego drewna.' },
  { name: 'Arturo Fuente Opus X', code: 'AF-001', flavor: 'Rosado', description: 'Legendarne cygaro z limitowanej produkcji. Liść okrywy uprawiany na Dominikanie.' },
  { name: 'Padron 1964 Anniversary', code: 'PA-001', flavor: 'Maduro', description: 'Wyrafinowane i złożone. Ciemny liść maduro z nutami czekolady i karmelu.' },
  { name: 'Rocky Patel Vintage 1990', code: 'RP-001', flavor: 'Connecticut', description: 'Dojrzały liść okrywy Connecticut. Kremowy, gładki profil z nutami wanilii.' },
  { name: 'Oliva Serie V Melanio', code: 'OL-001', flavor: 'Habano', description: 'Nagradzane cygaro z Nikaragui. Korzeń lukrecji, przyprawy i ciemne jagody.' },
  { name: 'Perdomo Champagne', code: 'PE-001', flavor: 'Champagne', description: 'Wyjątkowo łagodne i kremowe. Specjalnie starzony liść okrywy z Nikaragui.' },
  { name: 'Macanudo Cafe Hyde Park', code: 'MA-001', flavor: 'Connecticut', description: 'Idealny dla początkujących. Kremowy, łagodny smak z nutami orzechów i cedru.' },
  { name: 'Davidoff Winston Churchill Original', code: 'DW-001', flavor: 'Natural', description: 'Złożona mieszanka liści Dominikany. Nuty kawy, kakao i cedru.' },
  { name: 'CAO Cameroon Toro', code: 'CA-001', flavor: 'Cameroon', description: 'Rzadki liść okrywy z Kamerunu. Słodko-pikantny profil z nutami drewna cedrowego.' },
  { name: 'Alec Bradley Prensado', code: 'AB-001', flavor: 'Habano', description: 'Honduraskie cygaro docenione przez Cigar Aficionado. Nuty pieprzu i słodkiej masy.' },
  { name: 'Liga Privada No. 9', code: 'LP-009', flavor: 'Maduro', description: 'Kultowe cygaro Drew Estate. Bogaty, pełny smak z nutami czekolady i kawy.' },
  { name: 'Punch Punch Punch', code: 'PP-001', flavor: 'Natural', description: 'Klasyczne cygaro kubańskie o średniej mocy. Nuty skóry, cedru i earthy.' },
  { name: 'Hoyo de Monterrey Epicure No.1', code: 'HM-001', flavor: 'Natural', description: 'Aromatyczne i złożone. Jeden z najlepszych kubańskich rozmiarów Laguito.' },
  { name: 'San Cristobal Revelation', code: 'SC-001', flavor: 'Habano', description: 'Potężne nikaragueańskie cygaro. Nuty ziemi, pieprzu i ciemnej czekolady.' },
  { name: 'Tabak Especial Dulce Robusto', code: 'TE-001', flavor: 'Dulce', description: 'Unikalne cygaro infuzowane kawą. Kremowe, z nutami kawy i karmelu.' },
  { name: 'Nat Sherman Metropolitan', code: 'NS-001', flavor: 'Connecticut', description: 'Eleganckie nowojorskie cygaro. Gładkie, kremowe z subtelną słodyczą.' },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.productsRepository.count();
    if (count > 0) {
      console.log(`[Seed] Baza danych ma już ${count} produktów — pomijam seeding.`);
      return;
    }

    console.log('[Seed] Ładuję produkty do bazy danych...');
    for (const p of SEED_PRODUCTS) {
      const product = this.productsRepository.create(p);
      await this.productsRepository.save(product);
    }
    console.log(`[Seed] Dodano ${SEED_PRODUCTS.length} produktów ✅`);
  }
}
