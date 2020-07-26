const fs = require('fs');
const path = require('path');

const folderUpload = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
    destroy(file) {
        // Deletando o arquivo
        const filepath = `${folderUpload}\\${file}`

        fs.access(filepath, (error) => {
            // Um error significa que a o arquivo não existe, então não tentamos apagar
            if (error) {
                console.log(filepath, error);
                return {
                    error
                }
            }

            fs.unlink(filepath, error => {
                if (error) {
                    console.log(error)
                    return {
                        error
                    }
                }
            })
        });

        return {
            success: true
        };
    }
}