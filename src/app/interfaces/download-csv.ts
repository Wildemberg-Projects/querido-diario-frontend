export interface SearchResultCSV {
  id: string;
  municipio: string;
  uf: string;
  excerto: string;
  data_publicacao: string;
  edicao_extra: string;
  url_arquivo_txt: string;
  url_arquivo_original: string;
  numero_edicao?: string;

  // Below are the items available only on QD-Edu
  // These are lists joined into one string with ';' separator
  envolvidos?: string;  
  subtemas?: string;
}
