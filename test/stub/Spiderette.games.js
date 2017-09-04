///module.exports....

module.exports.wonGame = `
  ST:

  FO: [ KS],[ QS],[ JS],[10S],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S],[ 3S],[ 2S],[ AS],[ KH],[ QH],[ JH],[10H],[ 9H],[ 8H],[ 7H],[ 6H],[ 5H],[ 4H],[ 3H],[ 2H],[ AH],[ KD],[ QD],[ JD],[10D],[ 9D],[ 8D],[ 7D],[ 6D],[ 5D],[ 4D],[ 3D],[ 2D],[ AD],[ KC],[ QC],[ JC],[10C],[ 9C],[ 8C],[ 7C],[ 6C],[ 5C],[ 4C],[ 3C],[ 2C],[ AC]

  T0:
  T1:
  T2:
  T3:
  T4:
  T5:
  T6: `;

module.exports.sampleGame1 = `
  ST: ( 4D),( KD),( 6C),( 4S),( AC),( 3D),( KH),( 8D),( 3C),( AH),( 5H),( 3S),( 4H),( 5D),( QC),( 3H),( 9D),( AS),( 7D),( 2D),( QH),( 8S),( 7H),( KS)

  FO:

  T0: [ JD],[10H],[ 9S]
  T1: ( 5C),[ 9H],[ 8H],[ 7C]
  T2: ( 5S),(10S),[ JH]
  T3: [ AD]
  T4: ( JC),( 7S),[ 4C]
  T5: ( KC),( 6D),( 8C),(10D),(10C),[ 2C]
  T6: ( 9C),( 6H),( 2H),( QS),( 6S),( 2S),[ QD],[ JS]`;

// this is the game I'm stuck on....
module.exports.gameWithUnknownValues = `
  ST: ( 2D),( 4S),( 7S),( AH),( AC),( JD),( 9C),( 5H),( JC),( 3C),( 3D),( 9S),( JS),( KC),( 2C),( 3S),( 8S),( 5S),( AD),( QD),( KH),( 4C),( 6S),( JH)

  FO:

  T0: [ KS]
  T1: ( 8C),[ 4D]
  T2: ( 9H),( 7H),[ 8D]
  T3: (???),(???),( 4H),[10S]
  T4: (???),(???),(???),( 8H),[ KD]
  T5: ( QS),( QH),( 2S),( 9D),(10C),[ 6D]
  T6: (???),( 6H),( 6C),( 2H),( 7C),( 5C),[ QS]`;

module.exports.sampleGame2 = `
  ST: ( 4D),( KD),( 6C),( 4S),( AC),( 3D),( KH),( 8D),( 3C),( AH),( 5H),( 3S),( 4H),( 5D),( QC),( 3H),( 9D),( AS),( 7D),( 2D),( QH),( 8S),( 7H),( KS)

  FO:

  T0: [ JD]
  T1: ( 5C),[10H],[ 9S]
  T2: ( 5S),(10S),[ JH]
  T3: ( AD),( 7C),[ 8H]
  T4: ( JC),( 7S),( 4C),( 2C),[ 9H]
  T5: ( KC),( 6D),( 8C),(10D),(10C),[ JS]
  T6: ( 9C),( 6H),( 2H),( QS),( 6S),( 2S),[ QD]`;

module.exports.sampleGame3 = `
  ST: ( 4D),( KD),( 7H),( 4C),( AC),( 3D),( KH),( 8D),( 3C),( 5H)

  FO:

  T0: [ JH],[10H],[ 9H],[ 8H],[ 7C],[ 2C],[ AD],[ 7D]
  T1: [ QC],[ JC]
  T2: [ 6D]
  T3: [ JD],[ QH],[ 5D],[ 4H],[ 3H]
  T4: [ 9D]
  T5: ( KC),( 5C),( 8C),(10D),(10C),[ KS],[ QS],[ JS],[10S],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S],[ 3S],[ 2S],[ AS]
  T6: ( 9C),( 6H),( 2H),( QD),( 6C),[ 2D],[ AH]`;

module.exports.sampleGame4 = `
  ST: ( 4D),( KD),( 7H),( 4C),( AC),( 3D),( KH),( 8D),( 3C),( 5H)

  FO:

  T0: [ JH],[10H]
  T1: [ QC],[ JC]
  T2: [ 6D]
  T3: [ JD],[ QH],[ 5D],[ 4H],[ 3H]
  T4: [ 9D]
  T5: ( KC),( 5C),( 8C),(10D),(10C),[ KS],[ QS],[ JS],[10S],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S],[ 3S],[ 2S],[ AS]
  T6: ( 9C),( 6H),( 2H),( QD),( 6C),[ 9H],[ 8H],[ 7C],[ 2C],[ AD],[ 7D],[ 2D],[ AH]`;

module.exports.sampleGame5 = `
  ST: ( 4D),( KD),( 6C),( 4S),( AC),( 3D),( KH),( 9S),( 3C),( AH),( 5H),( 3S),( 4H),( 5D),( QC),( 3H),( 9D),( AS),( 7D),( 2D),( QH),( 8S),( 7H),( KS)

  FO:

  T0: [ JD]
  T1: ( 5C),[10H]
  T2: ( 5S),(10S),[ 8H]
  T3: ( AD),( 7C),( JH),[ 8D]
  T4: ( JC),( 7S),( 4C),( 9H),[ 2C]
  T5: ( KC),( JS),( 8C),(10D),(10C),[ 6D]
  T6: ( 9C),( 6H),( QD),( QS),( 6S),( 2S),[ 2H]`;

module.exports.sampleGame6 = `
  ST: ( 4D),( KD),( 6C),( 4S),( AC),( 3D),( KH),( 8D),( 3C),( AH),( 5H),( 3S),( 4H),( 5D),( QC),( 3H),( 9D)

  FO:

  T0: [ JH],[10H],[ 9S],[ 8S]
  T1: ( 5C),[ 9H],[ 8H],[ 7C],[ 7H]
  T2: ( 5S),(10S),[ JD],[ KS]
  T3: [ AD],[ QH]
  T4: ( JC),[ 4C],[ 2D],[ AS]
  T5: ( KC),( 6D),( 8C),(10D),(10C),[ 2C],[ 7S],[ 6S]
  T6: ( 9C),( 6H),( 2H),( QS),( 7D),( 2S),[ QD],[ JS]`;

module.exports.sampleGame7 = `
  ST: ( 4D),( KD),( 7H),( 4C),( AC),( 3D),( KH),( 8D),( 3C),( 5H)

  FO:

  T0: [ JH],[10H]
  T1: [ QC],[ JC]
  T2:
  T3: [ JD],[ QH],[ 5D],[ 4H],[ 3H]
  T4: ( 9D),[ 6D],[ 3S],[ 2S],[ AS]
  T5: ( KC),( 5C),( 8C),(10D),(10C),[ KS],[ QS],[ JS],[10S],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S]
  T6: ( 9C),( 6H),( 2H),( QD),( 6C),[ 9H],[ 8H],[ 7C],[ 2C],[ AD],[ 7D],[ 2D],[ AH]`;

module.exports.sampleGame8 = `
  ST:

  FO:

  T0: [ QC],[ JH],[10H],[ 5H],[ 7H]
  T1:
  T2:
  T3: ( 3C),( KD),[ JD],[ QH],[ 5D],[ 4H],[ 3H],[ KH]
  T4: ( 9D),[ 6D],[ 3S],[ 4D],[ 3D],[ 2S],[ AS]
  T5: ( KC),( 5C),( 8C),(10D),(10C),[ KS],[ QS],[ JS],[10S],[ 8D],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S],[ AC]
  T6: ( 9C),( 6H),( 2H),( QD),( 6C),[ JC],[ 9H],[ 8H],[ 7C],[ 2C],[ AD],[ 7D],[ 2D],[ AH],[ 4C]`;

module.exports.sampleGame9 = `
  ST: ( 7H),( KH),( AS)

  FO:

  T0: [ QC],[ JH],[10H],[ 5H]
  T1:
  T2:
  T3: ( 3C),( KD),[ JD],[ QH],[ 5D],[ 4H],[ 3H]
  T4: ( 9D),[ 6D],[ 3S],[ 4D],[ 3D],[ 2S]
  T5: ( KC),( 5C),( 8C),(10D),(10C),[ KS],[ QS],[ JS],[10S],[ 8D],[ 9S],[ 8S],[ 7S],[ 6S],[ 5S],[ 4S],[ AC]
  T6: ( 9C),( 6H),( 2H),( QD),( 6C),[ JC],[ 9H],[ 8H],[ 7C],[ 2C],[ AD],[ 7D],[ 2D],[ AH],[ 4C]`;

module.exports.sampleGame10 = `
  ST: ( JC),( 7C),( 4D),( QC),( 2D),( 2C),( 5H),( AS),( 9C),( QD),( KS),( 6S),( AH),( QS),( 3H),( 6H),( 5D),( 2S),( 6C),( 2H),( JS),( 9D),( 4C),(10S)

  FO:

  T0: [ JD],[10D]
  T1: [ 9H]
  T2: ( 5C),( 3S),[ KD]
  T3: ( JH),( KC),( AD),[ 3D]
  T4: ( AC),( 7S),( 7D),( 6D),[10C]
  T5: ( 9S),( 4H),( KH),( 8C),( 5S),[ QH]
  T6: (10H),( 3C),( 7H),( 8H),( 8D),( 8S),[ 4S]`;

module.exports.sampleGame11 = `
  ST: (10D),( 4D),( 3C),( KD),( QD),(10S),(10C),( 8H),( 6H),( KC),( 2C),( 9S),( 3H),( 9C),( QH),( JC),( 3S),( 6C),( 9D),( 7H),( 4H),( QS),(10H),( 8S)

  FO:

  T0: [ AC]
  T1: [ 5H],[ 4S]
  T2: ( 7S),( KH),[ 8C],[ 7C],[ 6D],[ 5D],[ 4C]
  T3: ( AD),[ AS]
  T4: ( 6S),( 9H),( KS),[ QC],[ JH]
  T5: ( 2H),( 5S),( JD),( 7D),[ JS]
  T6: ( 5C),( 2D),( 2S),( AH),( 3D),[ 8D]`;

module.exports.sampleGame12 = `
  ST: ( 2D),( KH),( 4D),( QS),(10S),( JC),( 4C),( 5S),( QC),( 5H),( 4S),( 7D),( QH),( JS),(10D),( 9D),( 8H),( 5C),( 9C),( JH),( 5D),( KD),( 8S),( 7C)

  FO:

  T0: [ 7S]
  T1: ( 3S),[ KC]
  T2: ( KS),( 6S),[ AD]
  T3: ( AS),( 6H),( 8C),[ 9H]
  T4: ( AH),(10C),( 3C),( 2C),[ 7H]
  T5: ( 6C),( 8D),( QD),(10H),( JD),[ AC]
  T6: ( 2S),( 3H),( 9S),( 2H),( 4H),( 3D),[ 6D]`;

module.exports.sampleGame13 = `
  ST: ( 2D),( KH),( 4D),( QS),(10S),( JC),( 4C),( 5S),( QC),( 5H),( 4S),( 7D),( QH),( JS),(10D),( 9D),( 8H)

  FO:

  T0: [ 7S],[ 7C]
  T1: ( 3S),[ KC],[ 8S]
  T2: ( KS),( 6S),[ AD],[ KD]
  T3: ( AS),( 6H),( 8C),[ 9H],[ 5D]
  T4: ( AH),(10C),( 3C),( 2C),[ 7H],[ 6D],[ JH]
  T5: ( 6C),( 8D),( QD),(10H),( JD),[ AC],[ 9C]
  T6: ( 2S),( 3H),( 9S),( 2H),( 4H),[ 3D],[ 5C]`;
