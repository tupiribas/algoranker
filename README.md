# AlgoRanker - Visualizador Interativo de Algoritmos de Ordenação

## 1. Visão Geral do Projeto

**AlgoRanker** é uma aplicação web interativa desenvolvida como parte do projeto acadêmico da disciplina de **Algoritmos e Complexidade**. O objetivo principal é demonstrar visualmente o funcionamento de diferentes algoritmos de ordenação, permitindo que os usuários observem o processo passo a passo em tempo real.

A aplicação gerencia um ranking de jogadores com base em suas pontuações e utiliza os algoritmos **BubbleSort**, **MergeSort** e **QuickSort** para ordenar a lista, destacando os elementos comparados e trocados a cada etapa.

### Equipe
*   Tupi Guedes Ribas

### Link para a Aplicação (Deploy)
*   [https://algoranker.fly.dev/](https://algoranker.fly.dev/)

---

## 2. Funcionalidades

*   **Visualização de Ranking:** Exibe uma lista de jogadores com seus nomes e pontuações.
*   **Adição e Remoção de Jogadores:** Permite adicionar novos jogadores ou remover existentes de forma dinâmica.
*   **Ordenação Interativa:** Ordena o ranking utilizando três algoritmos diferentes, com animações que ilustram o processo.
*   **Painel de Estatísticas:** Mostra dados agregados como número de jogadores, pontuação máxima, mínima e média.
*   **Análise de Complexidade:** Apresenta um modal com informações detalhadas sobre a complexidade assintótica de cada algoritmo.

---

## 3. Tecnologias Utilizadas

*   **Frontend:**
    *   **React:** Biblioteca JavaScript para construir a interface de usuário.
    *   **TypeScript:** Superset do JavaScript que adiciona tipagem estática para maior robustez do código.
    *   **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
*   **Backend e Banco de Dados:**
    *   Este projeto foca exclusivamente no **frontend** para a demonstração dos algoritmos. Os dados são inicializados e mantidos em memória (estado do React), não havendo integração com backend ou banco de dados.

---

## 4. Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone 
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Abra o arquivo `index.html` em seu navegador de preferência.**
    *   O projeto foi estruturado com scripts importados via CDN e não requer um processo de build.

---

## 5. Análise de Algoritmos e Estruturas de Dados

### 5.1. Estrutura de Dados Utilizada: Array

A estrutura de dados principal da aplicação é o **Array** (vetor) para armazenar a lista de jogadores. Cada jogador é um objeto com `id`, `name` e `score`.

*   **Justificativa da Escolha:**
    *   **Acesso Direto:** O acesso a elementos por índice em `O(1)` é ideal para a visualização, pois permite destacar, ler e modificar jogadores de forma eficiente durante as animações.
    *   **Simplicidade:** É a estrutura mais natural para representar uma lista ou ranking, facilitando a implementação e a compreensão dos algoritmos de ordenação.
    *   **Compatibilidade:** Os algoritmos de ordenação clássicos (QuickSort, MergeSort, BubbleSort) são projetados para operar diretamente sobre arrays.

### 5.2. Algoritmos de Ordenação Implementados

#### a) BubbleSort

*   **Descrição:** Um algoritmo simples que percorre a lista repetidamente, comparando pares de elementos adjacentes e trocando-os se estiverem na ordem errada. O processo continua até que nenhuma troca seja necessária.
*   **Complexidade Assintótica:**
    | Caso          | Complexidade |
    | ------------- | ------------ |
    | **Melhor**    | `O(n)`       |
    | **Médio**     | `O(n²)`      |
    | **Pior**      | `O(n²)`      |

#### b) MergeSort

*   **Técnica Especial:** Divisão e Conquista.
*   **Descrição:** O algoritmo divide o array em duas metades, ordena cada metade recursivamente e, em seguida, mescla as duas metades ordenadas para produzir o resultado final.
*   **Complexidade Assintótica:**
    | Caso          | Complexidade |
    | ------------- | ------------ |
    | **Melhor**    | `O(n log n)` |
    | **Médio**     | `O(n log n)` |
    | **Pior**      | `O(n log n)` |
*   **Recursividade:** A função `mergeSortHelper` é recursiva.
    *   **Caso Base:** Se o sub-array tem 0 ou 1 elemento (`startIdx >= endIdx`), ele já está ordenado e a recursão para.
    *   **Passo Recursivo:** Divide o sub-array ao meio e chama a si mesma para a metade esquerda e a metade direita. Após o retorno das chamadas, a função `doMerge` combina os resultados.
*   **Equação de Recorrência:**
    *   `T(n) = 2T(n/2) + O(n)`
    *   Onde `2T(n/2)` representa as duas chamadas recursivas para as metades do array, e `O(n)` é o custo da mesclagem (`doMerge`). Pelo Teorema Mestre, a solução é `O(n log n)`.

#### c) QuickSort

*   **Técnica Especial:** Divisão e Conquista.
*   **Descrição:** Escolhe um elemento como "pivô" e particiona o array de forma que todos os elementos menores que o pivô fiquem à sua esquerda e os maiores à sua direita. O processo é então aplicado recursivamente aos sub-arrays.
*   **Complexidade Assintótica:**
    | Caso          | Complexidade |
    | ------------- | ------------ |
    | **Melhor**    | `O(n log n)` |
    | **Médio**     | `O(n log n)` |
    | **Pior**      | `O(n²)`      |
    | **Espaço**    | `O(log n)`   |
*   **Recursividade:** A função `quickSortHelper` é recursiva.
    *   **Caso Base:** Se o ponteiro `low` for maior ou igual a `high`, o sub-array tem 0 ou 1 elemento e a recursão para.
    *   **Passo Recursivo:** Particiona o array com a função `partition` para encontrar a posição final do pivô. Em seguida, chama a si mesma para os sub-arrays à esquerda e à direita do pivô.
*   **Equação de Recorrência:**
    *   **Caso Médio/Melhor:** `T(n) = 2T(n/2) + O(n)`. Ocorre quando o pivô divide o array em metades aproximadamente iguais. A solução é `O(n log n)`.
    *   **Pior Caso:** `T(n) = T(n-1) + O(n)`. Ocorre quando o pivô é sempre o menor ou maior elemento, gerando partições desbalanceadas. A solução é `O(n²)`.
