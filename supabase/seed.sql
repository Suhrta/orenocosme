-- =============================================
-- Categories
-- =============================================
insert into categories (name, slug, sort_order) values
  ('洗顔',         'face-wash',     1),
  ('化粧水',       'toner',         2),
  ('乳液',         'emulsion',      3),
  ('オールインワン', 'all-in-one',    4),
  ('BBクリーム',    'bb-cream',      5),
  ('日焼け止め',    'sunscreen',     6);

-- =============================================
-- Brands (20)
-- =============================================
insert into brands (name, slug, description, official_url) values
  ('BULK HOMME',    'bulk-homme',    'メンズスキンケアブランドの先駆け。シンプルで洗練されたデザインと高品質な成分で、男性の肌を考え抜いたプロダクトを展開。', 'https://bulk.co.jp'),
  ('ORBIS Mr.',     'orbis-mr',      'ポーラ・オルビスグループのメンズライン。オイルカット×高保湿のスキンケアで、ベタつきと乾燥の両方にアプローチ。', 'https://www.orbis.co.jp'),
  ('無印良品',      'muji',          '手頃な価格と高品質を両立するライフスタイルブランド。敏感肌シリーズが男女問わず支持されている。', 'https://www.muji.com'),
  ('UNO',           'uno',           '資生堂のメンズマスブランド。手軽な価格帯でオールインワンジェルやBBクリームなど幅広く展開。', 'https://www.shiseido.co.jp/uno/'),
  ('SHISEIDO MEN',  'shiseido-men',  '資生堂が展開するメンズ総合スキンケアライン。長年の研究に基づく高機能処方で、エイジングケアにも対応。', 'https://www.shiseido.co.jp/shiseido-men/'),
  ('NULL',          'null-cosme',    '男性特有の肌悩みに特化したメンズコスメブランド。BBクリームやオールインワンなど実用的なラインナップが人気。', 'https://mens-null.net'),
  ('ZIGEN',         'zigen',         '純国産のメンズコスメブランド。オールインワンフェイスジェルが代表商品で、シンプルケアを提案。', 'https://www.zigen-shop.com'),
  ('GATSBY',        'gatsby',        'マンダムの代表的メンズブランド。洗顔・整髪料・ボディケアまで幅広く展開し、若年層を中心に人気。', 'https://www.gatsby.jp'),
  ('DHC for MEN',   'dhc-for-men',   'DHCのメンズライン。スキンケアからサプリメントまで展開し、通販を中心に根強い人気。', 'https://www.dhc.co.jp'),
  ('マニフィーク',   'magnifique',    'KOSEのメンズスキンケアブランド。洗練されたデザインとコスパの良さで20〜30代に支持されている。', 'https://magnifique.jp'),
  ('BOTCHAN',       'botchan',       '「新しい男らしさ」を提案するメンズコスメブランド。カラフルなパッケージと自然由来成分が特徴。', 'https://botchan.tokyo'),
  ('THREE for MEN', 'three-for-men', 'THREEのメンズライン。天然由来成分にこだわった処方で、上質なスキンケア体験を提供。', 'https://www.threecosmetics.com'),
  ('&GINO',         'and-gino',      'プレミアムフェイスウォッシュやオールインワンが人気のメンズコスメブランド。大人の男性に向けたエイジングケア。', 'https://andgino.jp'),
  ('クワトロボタニコ', 'quattro-botanico', '植物由来成分にこだわるメンズスキンケアブランド。ボタニカルローション&アフターシェーブが代表商品。', 'https://www.quattro-botanico.com'),
  ('ASTALIFT MEN',  'astalift-men',  '富士フイルムの技術を活かしたメンズスキンケアライン。アスタキサンチン配合でエイジングケアに特化。', 'https://shop-healthcare.fujifilm.jp'),
  ('ニベアメン',     'nivea-men',     '世界的スキンケアブランドNIVEAのメンズライン。手頃な価格で高品質なスキンケアを提供。', 'https://www.nivea.co.jp'),
  ('ルシード',       'lucido',        'マンダムの大人向けメンズブランド。40代以降の肌悩みに対応するエイジングケアラインが充実。', 'https://www.lucido.jp'),
  ('メンズビオレ',   'mens-biore',    '花王のメンズスキンケアブランド。手軽さとコスパの良さで幅広い年齢層に支持されている。', 'https://www.kao.co.jp/mensbiore/'),
  ('OXY',           'oxy',           'ロート製薬のメンズスキンケアブランド。ニキビケアや毛穴ケアに特化したラインナップ。', 'https://www.rohto.co.jp/oxy/'),
  ('サクセス',       'success',       '花王のメンズグルーミングブランド。シャンプー・育毛からスキンケアまで幅広い男性ケアを展開。', 'https://www.kao.co.jp/success/');

-- =============================================
-- Products (~55)
-- =============================================

-- BULK HOMME (brand_id=1)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (1, 1, 'THE FACE WASH 洗顔料',           'bulk-homme-face-wash',   2200, '100g'),
  (1, 2, 'THE TONER 化粧水',               'bulk-homme-toner',       3300, '200ml'),
  (1, 3, 'THE LOTION 乳液',                'bulk-homme-lotion',      3300, '100g'),
  (1, 6, 'THE SUNSCREEN 日焼け止め',        'bulk-homme-sunscreen',   2200, '40g');

-- ORBIS Mr. (brand_id=2)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (2, 1, 'ミスター ウォッシュ',              'orbis-mr-wash',          1760, '110g'),
  (2, 2, 'ミスター ローション',              'orbis-mr-lotion',        2200, '150ml'),
  (2, 3, 'ミスター モイスチャー',            'orbis-mr-moisture',      2420, '50g');

-- 無印良品 (brand_id=3)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (3, 1, 'マイルド洗顔フォーム',             'muji-mild-face-wash',     550, '120g'),
  (3, 2, '化粧水・敏感肌用・しっとりタイプ',   'muji-sensitive-toner',    690, '200ml'),
  (3, 3, '乳液・敏感肌用・しっとりタイプ',     'muji-sensitive-emulsion', 690, '200ml'),
  (3, 4, 'オールインワンジェル',              'muji-all-in-one-gel',     990, '100g');

-- UNO (brand_id=4)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (4, 1, 'ホイップウォッシュ ブラック',       'uno-whip-wash-black',     550, '130g'),
  (4, 4, 'クリームパーフェクション',           'uno-cream-perfection',    1078, '90g'),
  (4, 5, 'フェイスカラークリエイター',         'uno-face-color-creator',  1078, '30g');

-- SHISEIDO MEN (brand_id=5)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (5, 1, 'フェイスクレンザー',               'shiseido-men-cleanser',   2200, '130g'),
  (5, 2, 'ハイドレーティングローション',       'shiseido-men-lotion',     2750, '150ml'),
  (5, 3, 'モイスチャーライジング エマルジョン', 'shiseido-men-emulsion',   3850, '100ml');

-- NULL (brand_id=6)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (6, 1, '薬用アクネブロック フェイスウォッシュ', 'null-face-wash',        1980, '120g'),
  (6, 4, 'オールインワンミスト',                  'null-all-in-one-mist',  3036, '200ml'),
  (6, 5, 'BBクリーム',                            'null-bb-cream',         1915, '20g'),
  (6, 6, '日焼け止めジェル',                      'null-sunscreen-gel',    1980, '40g');

-- ZIGEN (brand_id=7)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (7, 4, 'オールインワン フェイスジェル',    'zigen-all-in-one-gel',   4400, '100g'),
  (7, 6, 'UVクリームジェル',                'zigen-uv-cream-gel',     3300, '50g'),
  (7, 1, 'フェイスウォッシュ',              'zigen-face-wash',         2750, '100g');

-- GATSBY (brand_id=8)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (8, 1, 'フェイシャルウォッシュ パーフェクトスクラブ', 'gatsby-facial-wash-scrub', 440, '130g'),
  (8, 1, 'フェイシャルウォッシュ ディープクリーニング',  'gatsby-facial-wash-deep',  440, '130g'),
  (8, 6, 'パーフェクトUV スプレー',                     'gatsby-perfect-uv-spray',  880, '60g');

-- DHC for MEN (brand_id=9)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (9, 1, 'フェースウォッシュ',              'dhc-men-face-wash',       1320, '150g'),
  (9, 2, 'スキンローション',                'dhc-men-skin-lotion',     1650, '150ml'),
  (9, 4, 'オールインワン モイスチュアジェル', 'dhc-men-all-in-one-gel',  1650, '200ml');

-- マニフィーク (brand_id=10)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (10, 1, 'ウォッシュ',                     'magnifique-wash',         1540, '130g'),
  (10, 4, 'トナー',                         'magnifique-toner',        1980, '150ml'),
  (10, 3, 'ミルク',                         'magnifique-milk',         1980, '100ml');

-- BOTCHAN (brand_id=11)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (11, 1, 'ジェントルマン クレンザー',       'botchan-cleanser',        2200, '100g'),
  (11, 2, 'フォレストトナー',               'botchan-forest-toner',    2200, '150ml'),
  (11, 3, 'フラワーモイスチャライザー',      'botchan-flower-moisturizer', 2200, '100ml');

-- THREE for MEN (brand_id=12)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (12, 1, 'バランシングステム ジェリーウォッシュ', 'three-men-balancing-stem-jelly-wash', 3300, '100g'),
  (12, 2, 'ジェントリング ローション',       'three-men-lotion',        4400, '100ml'),
  (12, 3, 'ジェントリング エマルジョン',     'three-men-emulsion',      4950, '60ml');

-- &GINO (brand_id=13)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (13, 1, 'プレミアムフェイスウォッシュ グランデ', 'andgino-premium-wash',   3960, '100g'),
  (13, 4, 'アクアモイス',                          'andgino-aqua-mois',      5280, '50ml');

-- クワトロボタニコ (brand_id=14)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (14, 1, 'ボタニカル フェイスウォッシュ',          'quattro-face-wash',       1980, '120g'),
  (14, 4, 'ボタニカル ローション&アフターシェーブ', 'quattro-botanical-lotion', 2200, '115ml');

-- ASTALIFT MEN (brand_id=15)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (15, 2, 'モイストローション',              'astalift-men-lotion',     3960, '120ml'),
  (15, 4, 'モイストクリア ジェリー',         'astalift-men-jelly',      4950, '60g');

-- ニベアメン (brand_id=16)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (16, 1, 'フェイスウォッシュ フレッシュ',   'nivea-men-face-wash',      440, '100g'),
  (16, 2, 'スキンコンディショナーバーム エイジング', 'nivea-men-conditioner', 880, '110ml'),
  (16, 6, 'UVプロテクター',                  'nivea-men-uv-protector',   880, '40ml');

-- ルシード (brand_id=17)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (17, 1, '薬用フェイスウォッシュ Q10',      'lucido-face-wash-q10',     660, '130g'),
  (17, 2, '薬用トータルケアローション Q10',  'lucido-total-care-lotion',  990, '110ml'),
  (17, 6, 'UVブロック',                      'lucido-uv-block',          880, '30ml');

-- メンズビオレ (brand_id=18)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (18, 1, '泡タイプ洗顔',                    'mens-biore-foam-wash',     440, '150ml'),
  (18, 2, '浸透化粧水 ローションタイプ',      'mens-biore-lotion',        770, '180ml'),
  (18, 6, 'UV パーフェクトプロテクト',        'mens-biore-uv-protect',    770, '30ml');

-- OXY (brand_id=19)
insert into products (brand_id, category_id, name, slug, price, volume) values
  (19, 1, 'パーフェクトウォッシュ',           'oxy-perfect-wash',         440, '130g'),
  (19, 2, 'モイストローション',               'oxy-moist-lotion',         660, '170ml'),
  (19, 4, 'オールインワンジェル',             'oxy-all-in-one-gel',       880, '90g');

-- =============================================
-- AI Review Pros / Cons
-- =============================================

UPDATE products SET
  ai_review_pros = ARRAY['少量で濃密な泡が作れて肌あたりが優しい', '洗い上がりがさっぱりしつつつっぱり感が少ない', '爽やかなシトラス系の香りが万人受けする'],
  ai_review_cons = ARRAY['チューブの口が大きく出しすぎる・キャップ式で片手で使えない', 'ドラッグストア商品と比べて価格が高い', '乾燥肌の人は洗い上がりのつっぱり感が気になるとの声も']
WHERE slug = 'bulk-homme-face-wash';

UPDATE products SET
  ai_review_pros = ARRAY['トップクラスの保湿力でしっとり仕上がる', 'ポンプ式で量の調節がしやすく使い勝手が良い', '無香料・無着色で肌への刺激が少ない'],
  ai_review_cons = ARRAY['ジュレ状で粘度が高く肌なじみがやや遅い', 'ドラッグストア商品と比べるとやや割高', 'ごく少数だが肌に合わず刺激を感じたという声も']
WHERE slug = 'orbis-mr-lotion';

UPDATE products SET
  ai_review_pros = ARRAY['1本で化粧水・乳液・美容液が完了しスキンケアが楽', '150g 1,490円と圧倒的なコスパの良さ', '低刺激で敏感肌でもピリつきにくいと好評'],
  ai_review_cons = ARRAY['冬場や乾燥が酷い人には保湿力が物足りない', 'チューブタイプでポンプ式に比べると使いにくい', '無香料のため香りでリフレッシュしたい人には物足りない']
WHERE slug = 'muji-all-in-one-gel';

UPDATE products SET
  ai_review_pros = ARRAY['カバー力が高くニキビ跡やクマを自然に隠せる', 'テカリにくく長時間崩れにくいと好評', '男性の肌色に合わせた色味で自然に仕上がる'],
  ai_review_cons = ARRAY['塗りすぎると厚塗り感が出やすい', 'クレンジングでしっかり落とす必要がある', '色展開が少なく肌色に合わない場合がある']
WHERE slug = 'null-bb-cream';

UPDATE products SET
  ai_review_pros = ARRAY['高い保湿力で乾燥肌の男性から特に好評', 'エイジングケア成分配合で30代以上に人気', '高級感のあるパッケージで洗面台に映える'],
  ai_review_cons = ARRAY['価格が4,000円台と他のメンズコスメより高め', '少量で伸びが良いが容量の割に減りが早い', '香りの好みが分かれるとの声がある']
WHERE slug = 'shiseido-men-emulsion';

-- =============================================
-- Amazon Ratings
-- =============================================

-- =============================================
-- A8 Affiliate Links
-- =============================================

-- ORBIS Mr. 全商品
UPDATE products SET affiliate_links = '{"a8": "https://px.a8.net/svt/ejp?a8mat=4B1SPR+DML78Y+1USQ+2Z68LU"}'::jsonb
WHERE brand_id = (SELECT id FROM brands WHERE slug = 'orbis-mr');

-- ZIGEN フェイスウォッシュ
UPDATE products SET affiliate_links = '{"a8": "https://px.a8.net/svt/ejp?a8mat=4B1SPR+DLEC1E+5CYY+NUES1"}'::jsonb
WHERE slug = 'zigen-face-wash';

-- ZIGEN オールインワン フェイスジェル
UPDATE products SET affiliate_links = '{"a8": "https://px.a8.net/svt/ejp?a8mat=4B1SPR+DEUKDU+5CYY+5YZ75"}'::jsonb
WHERE slug = 'zigen-all-in-one-gel';

-- =============================================
-- Amazon Ratings
-- =============================================

UPDATE products SET amazon_rating = 4.2, amazon_review_count = 105 WHERE slug = 'bulk-homme-face-wash';
UPDATE products SET amazon_rating = 4.4, amazon_review_count = 678 WHERE slug = 'orbis-mr-lotion';
UPDATE products SET amazon_rating = 4.4, amazon_review_count = 204 WHERE slug = 'muji-all-in-one-gel';
UPDATE products SET amazon_rating = 4.0, amazon_review_count = 6173 WHERE slug = 'null-bb-cream';
UPDATE products SET amazon_rating = 4.5, amazon_review_count = 75 WHERE slug = 'shiseido-men-emulsion';

-- =============================================
-- Product Images
-- =============================================

-- face-wash
UPDATE products SET image_url = '/images/products/face-wash/andgino-premium-wash.jpg' WHERE slug = 'andgino-premium-wash';
UPDATE products SET image_url = '/images/products/face-wash/botchan-cleanser.jpg' WHERE slug = 'botchan-cleanser';
UPDATE products SET image_url = '/images/products/face-wash/bulk-homme-the-face-wash.jpg' WHERE slug = 'bulk-homme-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/dhc-men-face-wash.jpg' WHERE slug = 'dhc-men-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/gatsby-facial-wash-deep.jpg' WHERE slug = 'gatsby-facial-wash-deep';
UPDATE products SET image_url = '/images/products/face-wash/gatsby-facial-wash-scrub.jpg' WHERE slug = 'gatsby-facial-wash-scrub';
UPDATE products SET image_url = '/images/products/face-wash/lucido-face-wash-q10.jpg' WHERE slug = 'lucido-face-wash-q10';
UPDATE products SET image_url = '/images/products/face-wash/magnifique-wash.jpg' WHERE slug = 'magnifique-wash';
UPDATE products SET image_url = '/images/products/face-wash/mens-biore-foam-wash.jpg' WHERE slug = 'mens-biore-foam-wash';
UPDATE products SET image_url = '/images/products/face-wash/muji-mild-face-wash.jpg' WHERE slug = 'muji-mild-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/nivea-men-face-wash.jpg' WHERE slug = 'nivea-men-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/null-face-wash.jpg' WHERE slug = 'null-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/orbis-mr-wash.jpg' WHERE slug = 'orbis-mr-wash';
UPDATE products SET image_url = '/images/products/face-wash/oxy-perfect-wash.jpg' WHERE slug = 'oxy-perfect-wash';
UPDATE products SET image_url = '/images/products/face-wash/quattro-face-wash.jpg' WHERE slug = 'quattro-face-wash';
UPDATE products SET image_url = '/images/products/face-wash/shiseido-men-cleanser.jpg' WHERE slug = 'shiseido-men-cleanser';
UPDATE products SET image_url = '/images/products/face-wash/three-men-foam.jpg' WHERE slug = 'three-men-balancing-stem-jelly-wash';
UPDATE products SET image_url = '/images/products/face-wash/uno-whip-wash-black.jpg' WHERE slug = 'uno-whip-wash-black';
UPDATE products SET image_url = '/images/products/face-wash/zigen-face-wash.jpg' WHERE slug = 'zigen-face-wash';
-- toner
UPDATE products SET image_url = '/images/products/toner/astalift-lotion.jpg' WHERE slug = 'astalift-men-lotion';
UPDATE products SET image_url = '/images/products/toner/bulk-homme-toner.jpg' WHERE slug = 'bulk-homme-toner';
UPDATE products SET image_url = '/images/products/toner/dhc-men-skin-lotion.png' WHERE slug = 'dhc-men-skin-lotion';
UPDATE products SET image_url = '/images/products/toner/lucido-total-care-lotion.jpg' WHERE slug = 'lucido-total-care-lotion';
UPDATE products SET image_url = '/images/products/toner/muji-sensitive-toner.jpg' WHERE slug = 'muji-sensitive-toner';
UPDATE products SET image_url = '/images/products/toner/orbis-mr-lotion.jpg' WHERE slug = 'orbis-mr-lotion';
UPDATE products SET image_url = '/images/products/toner/oxy-moist-lotion.jpg' WHERE slug = 'oxy-moist-lotion';
UPDATE products SET image_url = '/images/products/toner/shiseido-men-lotion.jpg' WHERE slug = 'shiseido-men-lotion';
UPDATE products SET image_url = '/images/products/toner/three-men-balancing-stem-lotion.jpg' WHERE slug = 'three-men-lotion';
UPDATE products SET image_url = '/images/products/toner/botchan-forest-toner.jpg' WHERE slug = 'botchan-forest-toner';
-- emulsion
UPDATE products SET image_url = '/images/products/emulsion/bulk-homme-the-face-lotion.jpg' WHERE slug = 'bulk-homme-lotion';
UPDATE products SET image_url = '/images/products/emulsion/orbis-mr-moisture.jpg' WHERE slug = 'orbis-mr-moisture';
UPDATE products SET image_url = '/images/products/emulsion/shiseido-men-emulsion.jpg' WHERE slug = 'shiseido-men-emulsion';
-- all-in-one
UPDATE products SET image_url = '/images/products/all-in-one/muji-all-in-one-gel.jpg' WHERE slug = 'muji-all-in-one-gel';
UPDATE products SET image_url = '/images/products/all-in-one/zigen-all-in-one-gel.jpg' WHERE slug = 'zigen-all-in-one-gel';
-- bb-cream
UPDATE products SET image_url = '/images/products/bb-cream/null-bb-cream.jpg' WHERE slug = 'null-bb-cream';
UPDATE products SET image_url = '/images/products/bb-cream/uno-face-color-creator.jpg' WHERE slug = 'uno-face-color-creator';
-- sunscreen
UPDATE products SET image_url = '/images/products/sunscreen/bulk-homme-the-face-thesunscreen.jpg' WHERE slug = 'bulk-homme-sunscreen';

-- =============================================
-- RETOUCH (brand_id=21)
-- =============================================

insert into brands (name, slug, description, official_url) values
  ('RETOUCH', 'retouch', 'YouTuber/美容師の宮永えいとが立ち上げたメンズグルーミングブランド。BBクリーム・リップクリームなどメンズメイク系を中心に展開。', 'https://re-touch.tokyo/');

insert into products (brand_id, category_id, name, slug, price, volume) values
  ((SELECT id FROM brands WHERE slug = 'retouch'), (SELECT id FROM categories WHERE slug = 'bb-cream'),
   'BBクリーム', 'retouch-bb-cream', 3300, '30g');

UPDATE products SET
  ai_review_pros = ARRAY['自然な仕上がりでバレにくいと好評', 'カバー力がありニキビ跡やクマを隠せる', 'チューブが小さく持ち運びしやすい'],
  ai_review_cons = ARRAY['3,300円とBBクリームとしてはやや高め', '色味が1色のみで肌色に合わない場合がある', '塗りすぎると厚塗り感が出やすい']
WHERE slug = 'retouch-bb-cream';

UPDATE products SET amazon_rating = 4.0, amazon_review_count = 241 WHERE slug = 'retouch-bb-cream';
