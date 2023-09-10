type LangMap = { [text: string]: { [lang: string]: string } };

export const defaultI18n: LangMap = {
    'Select the number first': {
        'zh-cn': '请先选中数字',
        'ja-jp': '最初に数字を選択してください。',
        'zh-tw': '請先選中數字',
        'th-th': 'เลือกหมายเลขก่อน',
        'es-es': 'Selecciona el número primero',
        'en-us': 'Select the number first',
        'ko-kr': '번호를 먼저 선택하세요',
        'fr-fr': 'Sélectionnez d’abord le numéro',
        'id-id': 'Pilih nomor terlebih dahulu',
        'ru-ru': 'Сначала выберите номер',
        'pt-br': 'Selecione o número primeiro',
        'de-de': 'Wählen Sie zuerst die Nummer aus',
        'it-it': 'Seleziona prima il numero',
        'vi-vn': 'Chọn số trước',
    },
    'Only numbers can be selected': {
        zh_cn: '只能选择阿拉伯数字',
        ja_jp: 'アラビア数字のみ選択できます。',
        zh_tw: '只能選擇阿拉伯數字',
        th_th: 'เลือกได้เฉพาะตัวเลขเท่านั้น',
        es_es: 'Solo se pueden seleccionar números arábigos',
        en_us: 'Only numbers can be selected',
        ko_kr: '숫자만 선택 가능',
        fr_fr: 'Seuls les numéros peuvent être sélectionnés',
        id_id: 'Hanya nomor yang dapat dipilih',
        ru_ru: 'Можно выбрать только цифры',
        pt_br: 'Somente números podem ser selecionados',
        de_de: 'Es können nur Zahlen ausgewählt werden',
        it_it: 'È possibile selezionare solo i numeri',
        vi_vn: 'Chỉ có thể chọn số',
    },
    'Please select where you want to add a pause': {
        zh_cn: '请先点击需要停顿的位置',
        ja_jp: 'まず停止する場所をクリックしてください',
        zh_tw: '請先點擊需要停頓的位置',
        th_th: 'ก่อนอื่น กรุณาคลิกตำแหน่งที่ต้องการหยุดก่อน',
        es_es: 'Primero haz clic donde quieras hacer la pausa.',
        en_us: 'Please select where you want to add a pause',
        ko_kr: '일시중지할 위치를 먼저 클릭하세요.',
        fr_fr: 'Veuillez sélectionner l’endroit où vous souhaitez ajouter une pause',
        id_id: 'Silakan pilih di mana Anda ingin menambahkan jeda',
        ru_ru: 'Сначала нажмите на место для паузы',
        pt_br: 'Clique onde deseja pausar primeiro',
        de_de: 'Bitte wählen Sie aus, wo Sie eine Pause einfügen möchten',
        it_it: 'Seleziona dove vuoi aggiungere una pausa',
        vi_vn: 'Vui lòng chọn nơi bạn muốn tạm dừng',
    },
    'Please select characters first': {
        zh_cn: '请先选中文字',
        ja_jp: 'まずテキストを選択してください',
        zh_tw: '請先選中文字',
        th_th: 'ก่อนอื่น กรุณาเลือกหนังสือเรียน',
        es_es: 'Selecciona el texto primero.',
        en_us: 'Please select characters first',
        ko_kr: '먼저 텍스트를 선택하십시오',
        fr_fr: 'Veuillez d’abord sélectionner les caractères',
        id_id: 'Silakan pilih karakter terlebih dahulu',
        ru_ru: 'Сначала выберете текст',
        pt_br: 'Por favor, selecione o texto primeiro',
        de_de: 'Bitte wählen Sie zuerst Zeichen aus',
        it_it: 'Seleziona prima i caratteri',
        vi_vn: 'Vui lòng chọn ký tự trước',
    },
    'Expanded': {
        zh_cn: '读数字',
        ja_jp: 'アラビア数字読み',
        zh_tw: '讀數字',
        th_th: 'ขยาย',
        es_es: 'Lectura numérica',
        en_us: 'Expanded',
        ko_kr: '퍼지는',
        fr_fr: 'Étendu',
        id_id: 'Diperluas',
        ru_ru: 'Расширенный',
        pt_br: 'expandido',
        de_de: 'Erweitert',
        it_it: 'allargato',
        vi_vn: 'mở rộng',
    },
    'Number by number': {
        zh_cn: '读数值',
        ja_jp: '漢数字読み',
        zh_tw: '讀數值',
        th_th: 'เลขต่อเลข',
        es_es: 'Lectura de cifras',
        en_us: 'Number by number',
        ko_kr: '번호로 번호',
        fr_fr: 'Numéro par numéro',
        id_id: 'Nomor demi nomor',
        ru_ru: 'Номер за номером',
        pt_br: 'Número por número',
        de_de: 'Nummer für Nummer',
        it_it: 'Numero per numero',
        vi_vn: 'Số theo số',
    },
    'Read phone': {
        zh_cn: '读电话',
        ja_jp: '電話を読んでください。',
        zh_tw: '讀電話',
        th_th: 'อ่านโทรศัพท์',
        es_es: 'Leer telefono',
        en_us: 'Read phone',
        ko_kr: '전화 읽기',
        fr_fr: 'Lire le téléphone',
        id_id: 'Baca telepon',
        ru_ru: 'Читать телефон',
        pt_br: 'Ler telefone',
        de_de: 'Telefon lesen',
        it_it: 'Leggi il telefono',
        vi_vn: 'Đọc điện thoại',
    },
    'DELETE': {
        zh_cn: '移除',
        ja_jp: '外す',
        zh_tw: '移除',
        th_th: 'ลบ',
        es_es: 'Eliminar',
        en_us: 'DELETE',
        ko_kr: '삭제',
        fr_fr: 'Supprimer',
        id_id: 'Menghapus',
        ru_ru: 'Удалить',
        pt_br: 'Excluir',
        de_de: 'Löschen',
        it_it: 'Eliminare',
        vi_vn: 'Xóa bỏ',
    },
};

const createLang = (lang: string, i18n = defaultI18n) => {
    return (key: string) => {
        return i18n[key] && i18n[key][lang] ? i18n[key][lang] : key;
    };
};

export default createLang;