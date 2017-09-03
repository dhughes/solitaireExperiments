require('../Util');

describe('Klondike', () => {
  test('String.prototype.indent', () => {
    // make a sample string:
    var sample = 'foo';

    // pad to 10 characters:
    sample = sample.indent(1);

    // should now be 13 chars long
    expect(sample.length).toBe(13);
  });

  test('Uint8Array.ofSize', () => {
    var sample = Uint8Array.ofSize(13);

    expect(sample.len()).toBe(0);
    expect(sample.length).toBe(13);
  });

  test('Uint8Array.prototype.len', () => {
    var sample = Uint8Array.ofSize(13);

    expect(sample.len()).toBe(0);
    sample[0] = 123;
    expect(sample.len()).toBe(1);
    sample[1] = 123;
    expect(sample.len()).toBe(2);

    // make a sample array:
    for (var i = 1; i < 20; i++) {
      sample = Uint8Array.ofSize(i);

      expect(sample.len()).toBe(0);

      for (var x = 0; x < i; x++) {
        sample[x] = x + 1;

        expect(sample.len()).toBe(x + 1);
      }
    }
  });

  test('Uint8Array.prototype.resetFrom', () => {
    var sample = Uint8Array.from([2, 4, 6, 8, 4, 12, 7, 23, 98]);

    sample.resetFrom(Uint8Array.from([1, 2, 3]));

    expect(sample).toEqual(expect.arrayContaining([1, 2, 3, 255, 255, 255, 255, 255, 255]));
  });

  test('Uint8Array.prototype.len calculates lenght from right side zeros', () => {
    var sample = Uint8Array.from([0, 0, 0, 0, 93, -1, -1]);

    expect(sample.len()).toEqual(5);
  });
});
