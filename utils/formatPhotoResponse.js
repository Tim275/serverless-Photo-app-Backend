module.exports = (list) => {
    const Bucket = process.env.THUMBMAIL_BUCKET_NAME;

    return list.map((item) => ({
       ...item,
       url: `https://${Bucket}.s3.amazonaws.com/${item.name}`
    }));
};