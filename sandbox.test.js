

it.only('things', () =>{
  let promise = Promise.reject(new Error('bam'))
  return expect(promise).rejects.toThrow('bam')
})

it('rejects to octopus', () => {
  return expect(Promise.reject(new Error('octopus'))).rejects.toThrow(
    'octopus',
  );
});