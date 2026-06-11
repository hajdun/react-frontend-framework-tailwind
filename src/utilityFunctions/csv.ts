import Papa from 'papaparse';



export function parseCsv(file: any) {

    const result = Papa.parse(file, { delimiter: ";" });
    const resultData = result.data

    const parsedResult = (resultData || []).map((rd: unknown) => {
        return {
            Main: rd[0], MET: rd[1]?.toString().replace(".", ","), ActivityDesc: rd[2]
        }
    }
    )
    return parsedResult
}


export function createCsv(data: any, fileName = "data.csv") {
    const csv = Papa.unparse(data, {
        delimiter: ";",
    });
    const bom = "\uFEFF";
    const blob = new Blob([bom, csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
}