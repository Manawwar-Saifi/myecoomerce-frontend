import React, { useEffect } from "react";

const DeleteSingleProductAditionalImage = ({ productId, imageId }) => {
  useEffect(() => {
    (async function () {
      const res = await fetch(
        `http://localhost:8000/api/delete-single-additional-image`,
        {
          method: "DELETE",
          "Content-Type": "application/json",
          body: {
            imageId: imageId,
          },
        }
      );
    })();
  }, []);

  return <div>DeleteSingleProductAditionalImage</div>;
};

export default DeleteSingleProductAditionalImage;
