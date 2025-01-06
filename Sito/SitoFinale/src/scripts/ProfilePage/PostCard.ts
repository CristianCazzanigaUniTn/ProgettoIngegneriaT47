export interface Post {
  id: string;  // ID del post
  title: string;  // Titolo del post
  description: string;  // Descrizione del post
  image: string;  // URL dell'immagine del post
}

export const getPost = async (id: string): Promise<Post[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/post/${id}`);

    if (!response.ok) {
      throw new Error('Post non trovati');
    }

    const postData = await response.json();

    if (!postData.posts || !Array.isArray(postData.posts)) {
      throw new Error('La risposta non contiene un array di post');
    }
    return postData.posts 
      .filter((post: any) => post.contenuto !== "null") 
      .map((post: any) => ({
        id: post.id,  
        title: post.luogo || "Titolo dinamico",  
        description: post.descrizione || "Descrizione dinamica",  
        image: post.contenuto || "/image/default-image.png", 
      }));
  } catch (error: any) {
    // Gestione degli errori
    console.error('Errore durante il recupero del post:', error.message);
    return [];  
  }
};
