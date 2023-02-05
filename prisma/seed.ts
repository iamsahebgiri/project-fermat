import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const problems: Prisma.ProblemCreateInput[] = [
  {
    title: "Multiples of 3 or 5",
    statement:
      '<p>If we list all the natural numbers below <span data-inline-katex="true">10 </span>that are multiples of <span data-inline-katex="true">3</span> or <span data-inline-katex="true">5</span>, we get<span data-inline-katex="true"> 3, 5, 6</span> and <span data-inline-katex="true">9</span>. The sum of these multiples is <span data-inline-katex="true">23</span>. Find the sum of all the multiples of <span data-inline-katex="true">3</span> or <span data-inline-katex="true">5</span> below <span data-inline-katex="true">1000</span>.</p>',
    solution: "233168",
  },
  {
    title: "Even Fibonacci numbers",
    statement:
      '<p>Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be: </p><katex content="1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ..."></katex><p>By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.</p>',
    solution: "4613732",
  },
  {
    title: "Largest prime factor",
    statement:
      '<p>The prime factors of <span data-inline-katex="true">13195</span> are <span data-inline-katex="true">5, 7, 13 </span> and <span data-inline-katex="true">29</span>. What is the largest prime factor of the number <span data-inline-katex="true">600851475143 </span>?</p>',

    solution: "6857",
  },
  {
    title: "Sum square difference",
    statement:
      '<p>The sum of the squares of the first ten natural numbers is,</p><p></p><katex content="1^2 + 2^2 + ... + 10^2 = 385"></katex><p></p><p>The square of the sum of the first ten natural numbers is,</p><katex content=" (1 + 2 + ... + 10)^2 = 55^2 = 3025 "></katex><p>Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is <span data-inline-katex="true">3025 - 385 = 2640</span>. Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.</p>',

    solution: "25164150",
  },
  {
    title: "Largest product in a series",
    statement:
      '<p>The four adjacent digits in the 1000-digit number that have the greatest product are <span data-inline-katex="true">9 × 9 × 8 × 9 = 5832</span>.</p><pre><code>73167176531330624919225119674426574742355349194934 \n96983520312774506326239578318016984801869478851843 \n85861560789112949495459501737958331952853208805511 \n12540698747158523863050715693290963295227443043557 \n66896648950445244523161731856403098711121722383113 \n62229893423380308135336276614282806444486645238749 \n30358907296290491560440772390713810515859307960866 \n70172427121883998797908792274921901699720888093776 \n65727333001053367881220235421809751254540594752243 \n52584907711670556013604839586446706324415722155397 \n53697817977846174064955149290862569321978468622482 \n83972241375657056057490261407972968652414535100474 \n82166370484403199890008895243450658541227588666881 \n16427171479924442928230863465674813919123162824586 \n17866458359124566529476545682848912883142607690042 \n24219022671055626321111109370544217506941658960408 \n07198403850962455444362981230987879927244284909188 \n84580156166097919133875499200524063689912560717606 \n05886116467109405077541002256983155200055935729725 \n71636269561882670428252483600823257530420752963450</code></pre><p></p><p>Find the thirteen adjacent digits in the 1000-digit number that have the greatest product. What is the value of this product?</p>',

    solution: "23514624000",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const problem of problems) {
    const p = await prisma.problem.create({
      data: problem,
    });
    console.log(`Created problem with id: ${p.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
