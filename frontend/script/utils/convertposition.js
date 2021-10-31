const convertPosition = (pos) => {
    if (pos >= 0 && pos <= 10) {
      return { y: pos, x: 0 };
    } else if (pos > 10 && pos <= 20) {
      return { y: 10, x: pos - 10 };
    } else if (pos > 20 && pos < 30) {
      return { y: 10 - (pos % 10), x: 10 };
    } else if (pos > 30 && pos < 40) {
      return { y: 0, x: 10 - (pos % 10) };
    } else if (pos === 40) {
      return { y: 0, x: 1 };
    } else if (pos === 30) {
      return { y: 0, x: 10 };
    } else {
      return "error: position not registered";
    }
  };
  