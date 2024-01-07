export const validateInput = (input) => {
      let is_valid = true
      Object.keys(input).forEach(i => {
          if(input[i].trim() === "") is_valid = false
      })

      return is_valid;
}