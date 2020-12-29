const indicatorsMock = [
  { _id: '5fadc0d4bdd3940021231a00', label: 'D.Y', value: '5,67%' },
  { _id: '5fadc0d4bdd3940021231a00', label: 'P/L', value: '12,87' },
  { _id: '5fadc0d4bdd3940021231a01', label: 'EV/EBITDA', value: '5,83' },
  { _id: '5fadc0d4bdd3940021231a02', label: 'P/VP', value: '1,62' },
  { _id: '5fadc0d4bdd3940021231a03', label: 'EV/EBIT', value: '11,50' },
  { _id: '5fadc0d4bdd3940021231a04', label: 'P/EBITDA', value: '5,62' },
  { _id: '5fadc0d4bdd3940021231a05', label: 'P/EBIT', value: '11,08' },
  { _id: '5fadc0d4bdd3940021231a06', label: 'VPA', value: '6,48' },
  { _id: '5fadc0d4bdd3940021231a07', label: 'P/ATIVO', value: '1,30' },
  { _id: '5fadc0d4bdd3940021231a08', label: 'LPA', value: '0,81' },
  { _id: '5fadc0d4bdd3940021231a09', label: 'P/SR', value: '16,09' },
  {
    _id: '5fadc0d4bdd3940021231a0a',
    label: 'P/CAP. GIRO',
    value: '23,05'
  },
  {
    _id: '5fadc0d4bdd3940021231a0b',
    label: 'P/ATIVO CIRC. LIQ.',
    value: '-1,45'
  },
  {
    _id: '5fadc0d4bdd3940021231a0c',
    label: 'DÍV. LÍQUIDA/PL',
    value: '0,02'
  },
  {
    _id: '5fadc0d4bdd3940021231a0d',
    label: 'DÍV. LÍQUIDA/EBITDA',
    value: '0,05'
  },
  {
    _id: '5fadc0d4bdd3940021231a0e',
    label: 'DÍV. LÍQUIDA/EBIT',
    value: '0,11'
  },
  { _id: '5fadc0d4bdd3940021231a0f', label: 'PL/ATIVOS', value: '0,81' },
  {
    _id: '5fadc0d4bdd3940021231a10',
    label: 'PASSIVO/ATIVOS',
    value: '0,15'
  },
  {
    _id: '5fadc0d4bdd3940021231a11',
    label: 'LIQ. CORRENTE',
    value: '2,32'
  },
  { _id: '5fadc0d4bdd3940021231a12', label: 'M. BRUTA', value: '28,31%' },
  {
    _id: '5fadc0d4bdd3940021231a13',
    label: 'M. EBITDA',
    value: '286,29%'
  },
  { _id: '5fadc0d4bdd3940021231a14', label: 'M. EBIT', value: '145,27%' },
  {
    _id: '5fadc0d4bdd3940021231a15',
    label: 'M. LÍQUIDA',
    value: '125,07%'
  },
  { _id: '5fadc0d4bdd3940021231a16', label: 'ROE', value: '12,56%' },
  { _id: '5fadc0d4bdd3940021231a17', label: 'ROA', value: '10,13%' },
  { _id: '5fadc0d4bdd3940021231a18', label: 'ROIC', value: '12,49%' },
  {
    _id: '5fadc0d4bdd3940021231a19',
    label: 'GIRO ATIVOS',
    value: '0,08'
  },
  {
    _id: '5fadc0d4bdd3940021231a1a',
    label: 'CAGR RECEITAS 5 ANOS',
    value: '-0,05%'
  },
  {
    _id: '5fadc0d4bdd3940021231a1b',
    label: 'CAGR LUCROS 5 ANOS',
    value: '5,31%'
  }
]

const valuationResultMock =
  '<code>5,67%\t\t\t</code> <code>D.Y</code>\n' +
  '<code>12,87\t\t\t</code> <code>P/L</code>\n<code>5,83\t\t\t\t</code> ' +
  '<code>EV/EBITDA</code>\n<code>1,62\t\t\t\t</code> ' +
  '<code>P/VP</code>\n<code>11,50\t\t\t</code> <code>EV/EBIT</code>\n<code>5,62\t\t\t\t</code> ' +
  '<code>P/EBITDA</code>\n<code>11,08\t\t\t</code> <code>P/EBIT</code>\n<code>6,48\t\t\t\t</code> ' +
  '<code>VPA</code>\n<code>1,30\t\t\t\t</code> <code>P/ATIVO</code>\n<code>0,81\t\t\t\t</code> ' +
  '<code>LPA</code>\n<code>16,09\t\t\t</code> <code>P/SR</code>\n<code>23,05\t\t\t</code> ' +
  '<code>P/CAP. GIRO</code>\n<code>-1,45\t\t\t</code> <code>P/ATIVO CIRC. LIQ.</code>\n'

const completeFundamentalsTextMock =
  '<b>ITSA4</b>\n\n<b>VALUATION</b>\n' + '<code>5,67%\t\t\t</code> ' + '<code>D.Y</code>\n' + '<code>12,87\t\t\t</code> ' +
  '<code>P/L</code>\n<code>5,83\t\t\t\t</code> <code>EV/EBITDA</code>\n' +
  '<code>1,62\t\t\t\t</code> <code>P/VP</code>\n<code>11,50\t\t\t</code> ' +
  '<code>EV/EBIT</code>\n<code>5,62\t\t\t\t</code> <code>P/EBITDA</code>\n<code>11,08\t\t\t</code> ' +
  '<code>P/EBIT</code>\n<code>6,48\t\t\t\t</code> <code>VPA</code>\n<code>1,30\t\t\t\t</code> ' +
  '<code>P/ATIVO</code>\n<code>0,81\t\t\t\t</code> <code>LPA</code>\n<code>16,09\t\t\t</code> ' +
  '<code>P/SR</code>\n<code>23,05\t\t\t</code> <code>P/CAP. GIRO</code>\n<code>-1,45\t\t\t</code> ' +
  '<code>P/ATIVO CIRC. LIQ.</code>\n\n<b>ENDIVIDAMENTO</b>\n<code>0,02\t\t\t\t</code> ' +
  '<code>DÍV. LÍQUIDA/PL</code>\n<code>0,05\t\t\t\t</code> <code>DÍV. LÍQUIDA/EBITDA</code>\n<code>0,11\t\t\t\t</code> ' +
  '<code>DÍV. LÍQUIDA/EBIT</code>\n<code>0,81\t\t\t\t</code> <code>PL/ATIVOS</code>\n<code>0,15\t\t\t\t</code> ' +
  '<code>PASSIVO/ATIVOS</code>\n<code>2,32\t\t\t\t</code> <code>LIQ. CORRENTE</code>\n\n<b>EFICIÊNCIA</b>\n<code>28,31%\t\t</code> ' +
  '<code>M. BRUTA</code>\n<code>286,29%\t</code> <code>M. EBITDA</code>\n<code>145,27%\t</code> <code>M. EBIT</code>\n<code>125,07%\t</code> ' +
  '<code>M. LÍQUIDA</code>\n\n<b>RENTABILIDADE</b>\n<code>12,56%\t\t</code> <code>ROE</code>\n<code>10,13%\t\t</code> <code>ROA</code>\n<code>12,49%\t\t</code> ' +
  '<code>ROIC</code>\n<code>0,08\t\t\t\t</code> <code>GIRO ATIVOS</code>\n\n<b>CRESCIMENTO</b>\n<code>-0,05%\t\t</code> ' +
  '<code>CAGR RECEITAS 5 ANOS</code>\n<code>5,31%\t\t\t</code> <code>CAGR LUCROS 5 ANOS</code>\n\n'

module.exports = { indicatorsMock, valuationResultMock, completeFundamentalsTextMock }
