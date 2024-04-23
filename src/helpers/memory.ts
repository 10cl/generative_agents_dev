import pako, {inflate} from "pako";

export async function loadLongMemory(){
  return new Promise((resolve, reject) => {

    const zipFileUrl = './assets/data/compressed-file.gz';
    fetch(zipFileUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('http request error');
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        // 解压缩数据
        const decompressedData = inflate(arrayBuffer, {to: 'string'});
        resolve(JSON.parse(decompressedData))
      })
      .catch(error => {
        console.error('compressed data error:', error);
        resolve(undefined)
      });
  })
}

export function getNewTextDiff(newText, previousText) {
  return newText.replace(previousText, '');
}

export function formatMessage(input: string){
    return input.replace(/^\s*[\r\n]/gm, '')
      .replace(/^#+\s/gm, '')
      .replace(/^(\s*[\-*+])\s/gm, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\*/g, '')
      .replace(/-/g, '');
}
