"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Star,
  CroissantIcon as Bread,
  Award,
  BookOpen,
  Gift,
  Clock,
  Wheat,
  Flame,
  ShoppingCart,
  Lock,
  Check,
  AlertCircle,
  Unlock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BreadQuiz() {
  const [xp, setXp] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [unlockedRecipes, setUnlockedRecipes] = useState([])
  const [activeTab, setActiveTab] = useState("quiz")
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  const levels = [
    { level: 1, name: "Aprendiz de Padeiro", xp: 0 },
    { level: 2, name: "Ajudante de Forno", xp: 30 },
    { level: 3, name: "Mestre das Massas", xp: 70 },
    { level: 4, name: "Padeiro Artesão", xp: 110 },
    { level: 5, name: "Mestre Padeiro", xp: 220 },
  ]

  const questions = [
    {
      question: "Qual fermento é o ideal para fazer um pão que cresce bastante e fica super fofo?",
      image: "https://i.imgur.com/tXRDnQ9.png",
      options: [
        { text: "Fermento químico", icon: "flask" },
        { text: "Fermento biológico fresco", icon: "bread" },
        { text: "Fermento seco instantâneo", icon: "box" },
      ],
      correct: "Fermento biológico fresco",
      feedbackCorrect:
        "Excelente escolha! O fermento biológico fresco dá volume e leveza ao pão. Ele contém mais umidade e células de levedura ativas que ajudam na fermentação.",
      feedbackIncorrect:
        "Hmm... esse fermento não é o ideal. O fermento biológico fresco contém mais umidade e células de levedura ativas que ajudam na fermentação perfeita.",
      explanation:
        "O fermento biológico fresco contém mais células de levedura ativas e umidade, o que resulta em uma fermentação mais vigorosa e um pão mais fofo. Ele é ideal para massas que precisam de bastante crescimento.",
    },
    {
      question: "Qual é a temperatura ideal para assar um pão de forma?",
      image: "https://i.imgur.com/4lF42re.png",
      options: [
        { text: "160°C", icon: "thermometer" },
        { text: "180°C", icon: "thermometer" },
        { text: "200°C", icon: "flame" },
      ],
      correct: "200°C",
      feedbackCorrect:
        "Perfeito! 200°C garante uma crosta dourada e um miolo macio. Esta temperatura permite que o pão cresça rapidamente no início e depois desenvolva uma crosta bonita.",
      feedbackIncorrect:
        "A temperatura ideal é 200°C. Esta temperatura permite que o pão cresça rapidamente no início e depois desenvolva uma crosta bonita.",
      explanation:
        "A temperatura de 200°C é ideal para pães de forma porque permite um crescimento inicial rápido (oven spring) e depois forma uma crosta dourada enquanto mantém o miolo úmido e macio.",
    },
    {
      question: "Qual é o ingrediente que dá o sabor característico ao pão?",
      image: "https://cdn-icons-png.flaticon.com/512/730/730150.png",
      options: [
        { text: "Açúcar", icon: "candy" },
        { text: "Sal", icon: "wheat" },
        { text: "Fermento", icon: "bread" },
      ],
      correct: "Sal",
      feedbackCorrect:
        "Isso mesmo! O sal equilibra e realça o sabor do pão. Além disso, ele controla a ação do fermento e fortalece o glúten.",
      feedbackIncorrect:
        "O sal é o segredo do sabor. Ele não apenas dá sabor, mas também controla a ação do fermento e fortalece o glúten.",
      explanation:
        "O sal é essencial para o sabor do pão, mas também tem funções técnicas: controla a velocidade da fermentação, fortalece a rede de glúten e ajuda na conservação do pão.",
    },
    {
      question: "Qual é o tempo mínimo necessário para que a massa de pão fermente adequadamente?",
      image: "https://cdn-icons-png.flaticon.com/512/3721/3721924.png",
      options: [
        { text: "1 hora", icon: "clock" },
        { text: "30 minutos", icon: "hourglass" },
        { text: "3 horas", icon: "hourglass" },
      ],
      correct: "1 hora",
      feedbackCorrect:
        "Excelente! 1 hora é ideal para uma fermentação eficiente em temperatura ambiente. Isso permite que as leveduras produzam gás suficiente.",
      feedbackIncorrect:
        "O ideal é 1 hora em temperatura ambiente. Isso permite que as leveduras produzam gás suficiente para um bom crescimento.",
      explanation:
        "A fermentação de pelo menos 1 hora permite que as leveduras produzam CO2 suficiente para dar volume ao pão e também desenvolve sabores complexos através da fermentação.",
    },
    {
      question: "Qual tipo de farinha é mais indicada para fazer pães de trigo?",
      image: "https://ser.vitao.com.br/wp-content/uploads/2017/08/shutterstock_419782864-1-920x535.jpg",
      options: [
        { text: "Farinha de trigo integral", icon: "bread" },
        { text: "Farinha de trigo branca", icon: "wheat" },
        { text: "Farinha de milho", icon: "seedling" },
      ],
      correct: "Farinha de trigo branca",
      feedbackCorrect:
        "Boa escolha! A farinha de trigo branca tem alto teor de glúten, o que garante pães macios e fofos com boa estrutura.",
      feedbackIncorrect:
        "A farinha de trigo branca é a melhor para pães macios. Ela tem alto teor de glúten, o que garante boa estrutura e maciez.",
      explanation:
        "A farinha de trigo branca tem maior teor de glúten e menos fibras que a integral, o que resulta em pães mais leves e macios. Ideal para pães de forma e franceses.",
    },
    {
      question: "O que é a autólise na preparação do pão?",
      image: "https://cdn-icons-png.flaticon.com/512/3721/3721924.png",
      options: [
        { text: "Processo de mistura de ingredientes", icon: "mixer" },
        { text: "Processo de descanso da massa", icon: "clock" },
        { text: "Processo de assamento", icon: "flame" },
      ],
      correct: "Processo de descanso da massa",
      feedbackCorrect:
        "Isso mesmo! A autólise é o descanso da mistura de farinha e água antes de adicionar os outros ingredientes. Isso melhora a textura e o sabor do pão.",
      feedbackIncorrect:
        "A autólise é o descanso da mistura de farinha e água antes de adicionar os outros ingredientes. Isso melhora a textura e o sabor do pão.",
      explanation:
        "Na autólise, a farinha e a água são misturadas e deixadas em repouso por 20-60 minutos antes de adicionar sal e fermento. Isso permite que as enzimas da farinha comecem a quebrar o amido e as proteínas, melhorando a extensibilidade da massa e o sabor final.",
    },
    {
      question: "Qual técnica ajuda a formar uma crosta crocante no pão?",
      image: "https://i.imgur.com/4lF42re.png",
      options: [
        { text: "Assar em baixa temperatura", icon: "thermometer" },
        { text: "Usar vapor no forno", icon: "cloud" },
        { text: "Adicionar mais açúcar", icon: "candy" },
      ],
      correct: "Usar vapor no forno",
      feedbackCorrect:
        "Perfeito! O vapor cria uma crosta crocante e brilhante. Ele retarda a formação da crosta, permitindo que o pão cresça mais antes de endurecer.",
      feedbackIncorrect:
        "O vapor no forno é o segredo. Ele retarda a formação da crosta, permitindo que o pão cresça mais antes de endurecer.",
      explanation:
        "O vapor no forno mantém a superfície da massa úmida por mais tempo, permitindo maior expansão antes da formação da crosta. Quando a água evapora, deixa a crosta fina e crocante. Padeiros profissionais usam fornos a vapor, mas em casa você pode colocar uma forma com água quente no fundo do forno.",
    },
    {
      question: "Qual é a proporção ideal de água para farinha em pães artesanais?",
      image: "https://cdn-icons-png.flaticon.com/512/3721/3721924.png",
      options: [
        { text: "50% de água", icon: "droplet" },
        { text: "70% de água", icon: "droplet" },
        { text: "90% de água", icon: "droplet" },
      ],
      correct: "70% de água",
      feedbackCorrect:
        "Correto! 70% de água (em relação ao peso da farinha) garante uma massa hidratada e elástica, ideal para pães artesanais.",
      feedbackIncorrect:
        "A proporção ideal é 70% de água (em relação ao peso da farinha). Isso garante uma massa hidratada e elástica, ideal para pães artesanais.",
      explanation:
        "A hidratação de 70% (70g de água para cada 100g de farinha) é considerada o ponto ideal para muitos pães artesanais. Proporciona boa estrutura de alvéolos, miolo macio e crosta crocante. Massas com hidratação mais alta (80-90%) são mais difíceis de manipular, mas podem criar pães com alvéolos maiores, como o ciabatta.",
    },
    {
      question: "Qual é o melhor método para sovar a massa de pão?",
      image: "https://i.imgur.com/tXRDnQ9.png",
      options: [
        { text: "Sovar rapidamente por 5 minutos", icon: "hand" },
        { text: "Sovar lentamente por 10-12 minutos", icon: "hand" },
        { text: "Não sovar, apenas misturar", icon: "mixer" },
      ],
      correct: "Sovar lentamente por 10-12 minutos",
      feedbackCorrect:
        "Exato! Sovas longas e lentas desenvolvem o glúten perfeitamente, criando uma estrutura elástica e forte.",
      feedbackIncorrect:
        "Sovar por 10-12 minutos é o ideal. Isso desenvolve o glúten perfeitamente, criando uma estrutura elástica e forte.",
      explanation:
        "A sova lenta e prolongada alinha as proteínas da farinha (gliadina e glutenina) para formar o glúten, criando uma rede elástica que retém o gás da fermentação. Uma massa bem sovada deve passar no 'teste da janela' - quando esticada, deve ficar fina o suficiente para ver luz através dela sem romper.",
    },
    {
      question: "Qual é o último passo antes de assar o pão?",
      image: "https://i.imgur.com/4lF42re.png",
      options: [
        { text: "Fazer cortes na massa", icon: "scissors" },
        { text: "Adicionar mais fermento", icon: "bread" },
        { text: "Congelar a massa", icon: "snowflake" },
      ],
      correct: "Fazer cortes na massa",
      feedbackCorrect: "Perfeito! Os cortes ajudam o pão a expandir de forma controlada e criam um visual incrível.",
      feedbackIncorrect:
        "Os cortes na massa são o último passo. Eles ajudam o pão a expandir de forma controlada e criam um visual incrível.",
      explanation:
        "Os cortes na superfície do pão (chamados de 'scoring') permitem que o pão expanda de forma controlada durante o assamento, evitando rachaduras aleatórias. Também criam o padrão decorativo característico de muitos pães artesanais. Use uma lâmina bem afiada ou um estilete de padeiro para cortes limpos.",
    },
    {
      question: "Qual é o benefício de usar uma pedra de pizza ou dutch oven para assar pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Economiza energia", icon: "battery" },
        { text: "Retém calor e umidade", icon: "flame" },
        { text: "Reduz o tempo de cozimento", icon: "clock" },
      ],
      correct: "Retém calor e umidade",
      feedbackCorrect:
        "Correto! Pedras de pizza e dutch ovens retêm e distribuem calor uniformemente, além de criar um ambiente úmido ideal para pães.",
      feedbackIncorrect:
        "Pedras de pizza e dutch ovens retêm e distribuem calor uniformemente, além de criar um ambiente úmido ideal para pães.",
      explanation:
        "Pedras de pizza e dutch ovens são excelentes para assar pães porque mantêm temperatura alta e constante, simulando fornos profissionais. O dutch oven também retém o vapor liberado pela massa, criando o ambiente úmido necessário para uma crosta perfeita. Isso resulta em pães com melhor crescimento, crosta crocante e miolo macio.",
    },
    {
      question: "Qual é a função do açúcar na receita de pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Apenas adoçar", icon: "candy" },
        { text: "Alimentar o fermento", icon: "bread" },
        { text: "Dar cor à crosta", icon: "palette" },
      ],
      correct: "Alimentar o fermento",
      feedbackCorrect:
        "Excelente! O açúcar serve principalmente como alimento para o fermento, acelerando a fermentação.",
      feedbackIncorrect: "O açúcar serve principalmente como alimento para o fermento, acelerando a fermentação.",
      explanation:
        "O açúcar é rapidamente consumido pelas leveduras do fermento, acelerando a fermentação. Também contribui para o sabor, maciez e ajuda no douramento da crosta (reação de Maillard). Em pequenas quantidades (1-2% do peso da farinha), o açúcar não deixa o pão doce, apenas otimiza a fermentação.",
    },
    {
      question: "Qual é a melhor maneira de armazenar pão caseiro?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Na geladeira", icon: "refrigerator" },
        { text: "Em saco plástico hermético", icon: "package" },
        { text: "Em pano de algodão ou papel", icon: "shirt" },
      ],
      correct: "Em pano de algodão ou papel",
      feedbackCorrect:
        "Correto! Panos de algodão ou papel permitem que o pão respire, mantendo a crosta crocante por mais tempo.",
      feedbackIncorrect:
        "Panos de algodão ou papel são ideais, pois permitem que o pão respire, mantendo a crosta crocante por mais tempo.",
      explanation:
        "Pães artesanais devem ser armazenados em materiais que permitam alguma circulação de ar, como panos de algodão ou sacos de papel. Isso preserva a textura da crosta. Plásticos herméticos fazem a crosta amolecer rapidamente. A geladeira acelera o ressecamento do pão. Para armazenamento mais longo, o ideal é fatiar e congelar o pão.",
    },
    {
      question: "O que é 'poolish' na panificação?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Um tipo de farinha polonesa", icon: "wheat" },
        { text: "Uma técnica de sova", icon: "hand" },
        { text: "Um pré-fermento líquido", icon: "droplet" },
      ],
      correct: "Um pré-fermento líquido",
      feedbackCorrect:
        "Perfeito! Poolish é um pré-fermento líquido feito com partes iguais de farinha e água, mais uma pequena quantidade de fermento.",
      feedbackIncorrect:
        "Poolish é um pré-fermento líquido feito com partes iguais de farinha e água, mais uma pequena quantidade de fermento.",
      explanation:
        "O poolish é um tipo de pré-fermento líquido (100% de hidratação) originário da Polônia. É preparado misturando partes iguais de farinha e água com uma pequena quantidade de fermento, deixando fermentar por 8-16 horas. Adiciona complexidade de sabor, melhora a textura e prolonga a vida útil do pão.",
    },
    {
      question: "Qual é a importância da 'tensão superficial' ao modelar pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Não tem importância", icon: "x" },
        { text: "Ajuda o pão a crescer para cima", icon: "arrow-up" },
        { text: "Apenas melhora a aparência", icon: "eye" },
      ],
      correct: "Ajuda o pão a crescer para cima",
      feedbackCorrect:
        "Correto! A tensão superficial criada ao modelar o pão direciona o crescimento para cima em vez de para os lados.",
      feedbackIncorrect:
        "A tensão superficial criada ao modelar o pão direciona o crescimento para cima em vez de para os lados.",
      explanation:
        "Criar tensão superficial ao modelar o pão é crucial para um bom crescimento vertical. Isso é feito puxando a massa para baixo e selando na parte inferior. Uma boa tensão superficial cria uma 'pele' que direciona a expansão dos gases para cima, resultando em pães mais altos e com melhor estrutura interna.",
    },
    {
      question: "Qual é o papel da gordura (óleo, manteiga) na massa do pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Apenas dar sabor", icon: "utensils" },
        { text: "Aumentar o tempo de fermentação", icon: "clock" },
        { text: "Tornar o miolo mais macio", icon: "feather" },
      ],
      correct: "Tornar o miolo mais macio",
      feedbackCorrect:
        "Exato! A gordura envolve as proteínas do glúten, tornando o miolo mais macio e prolongando a maciez do pão.",
      feedbackIncorrect:
        "A gordura envolve as proteínas do glúten, tornando o miolo mais macio e prolongando a maciez do pão.",
      explanation:
        "A gordura (óleo, manteiga, banha) lubrifica as fibras de glúten, resultando em um miolo mais macio e tenro. Também retarda o envelhecimento do pão, mantendo-o fresco por mais tempo. Pães enriquecidos com gordura (como brioche) são mais macios, enquanto pães sem gordura (como baguetes) têm crosta mais crocante e miolo mais firme.",
    },
    {
      question: "O que significa 'ponto de véu' na massa de pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Quando a massa fica transparente", icon: "eye" },
        { text: "Quando a massa não gruda mais", icon: "hand" },
        { text: "Quando a massa dobra de tamanho", icon: "maximize" },
      ],
      correct: "Quando a massa fica transparente",
      feedbackCorrect:
        "Correto! O 'ponto de véu' é quando a massa pode ser esticada até ficar fina e translúcida sem romper.",
      feedbackIncorrect: "O 'ponto de véu' é quando a massa pode ser esticada até ficar fina e translúcida sem romper.",
      explanation:
        "O 'ponto de véu' ou 'teste da janela' é uma técnica para verificar se o glúten está bem desenvolvido. Pegue um pedaço de massa e estique-o com os dedos - se puder esticá-lo até ficar fino e translúcido sem romper, o glúten está bem desenvolvido e a massa está pronta para fermentar.",
    },
    {
      question: "Qual é a função da 'dobra' durante a fermentação da massa?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Apenas para dar formato", icon: "square" },
        { text: "Redistribuir o fermento", icon: "refresh-cw" },
        { text: "Fortalecer o glúten sem sovar", icon: "trending-up" },
      ],
      correct: "Fortalecer o glúten sem sovar",
      feedbackCorrect:
        "Perfeito! As dobras durante a fermentação reorganizam e alinham as fibras de glúten, fortalecendo a estrutura da massa sem sovar excessivamente.",
      feedbackIncorrect:
        "As dobras durante a fermentação reorganizam e alinham as fibras de glúten, fortalecendo a estrutura da massa sem sovar excessivamente.",
      explanation:
        "A técnica de dobras (stretch and fold) é uma alternativa à sova tradicional. Consiste em esticar a massa e dobrá-la sobre si mesma várias vezes durante a fermentação. Isso alinha as fibras de glúten, fortalece a estrutura da massa, distribui uniformemente a temperatura e os açúcares, e incorpora oxigênio, tudo sem desgastar o glúten como na sova prolongada.",
    },
    {
      question: "Por que é importante a 'fermentação final' antes de assar o pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Para desenvolver mais glúten", icon: "link" },
        { text: "Para dar volume final ao pão", icon: "maximize" },
        { text: "Para reduzir o tempo de forno", icon: "clock" },
      ],
      correct: "Para dar volume final ao pão",
      feedbackCorrect:
        "Correto! A fermentação final (após modelar) permite que o pão atinja seu volume ideal antes de ir ao forno.",
      feedbackIncorrect:
        "A fermentação final (após modelar) permite que o pão atinja seu volume ideal antes de ir ao forno.",
      explanation:
        "A fermentação final (ou proof) ocorre após a modelagem do pão. Nesta fase, a massa já modelada descansa até quase dobrar de volume. É crucial não subestimar nem exagerar neste tempo: pouca fermentação resulta em pão denso, enquanto fermentação excessiva pode fazer o pão colapsar no forno. O teste do dedo (pressionar levemente a massa - deve voltar lentamente) ajuda a determinar o ponto ideal.",
    },
    {
      question: "O que é 'massa madre' ou 'levain'?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Um tipo de farinha especial", icon: "wheat" },
        { text: "Fermento natural cultivado", icon: "seedling" },
        { text: "Uma técnica de modelagem", icon: "hand" },
      ],
      correct: "Fermento natural cultivado",
      feedbackCorrect:
        "Excelente! Massa madre ou levain é um fermento natural cultivado a partir de farinha, água e microrganismos do ambiente.",
      feedbackIncorrect:
        "Massa madre ou levain é um fermento natural cultivado a partir de farinha, água e microrganismos do ambiente.",
      explanation:
        "A massa madre (ou levain, sourdough) é um fermento natural cultivado a partir de farinha e água, que captura leveduras e bactérias selvagens do ambiente. Diferente do fermento comercial, contém múltiplas espécies de microrganismos, principalmente leveduras e bactérias láticas, que fermentam a massa mais lentamente e produzem ácidos que dão o sabor característico e prolongam a vida útil do pão.",
    },
  ]

  const recipes = [
    {
      id: 1,
      title: "Pão Caseiro Básico Super Macio",
      description: "Receita infalível para iniciantes, com resultado profissional",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 2,
    },
    {
      id: 2,
      title: "Pão Italiano com Azeite e Ervas",
      description: "Pão macio com sabor mediterrâneo e crosta crocante",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 4,
    },
    {
      id: 3,
      title: "Pão de Fermentação Natural Simplificado",
      description: "Técnica de fermentação natural sem complicações",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 6,
    },
    {
      id: 4,
      title: "Brioche Francês Premium",
      description: "Pão enriquecido com manteiga e ovos, perfeito para café da manhã",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 8,
    },
    {
      id: 5,
      title: "Pão Artesanal Rústico de Fermentação Lenta",
      description: "Técnica profissional de hidratação alta e fermentação prolongada",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 10,
    },
    {
      id: 6,
      title: "Pão de Batata Ultra Macio",
      description: "O segredo dos padeiros para pães que derretem na boca",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 12,
    },
    {
      id: 7,
      title: "Pão Integral 100% Saudável e Macio",
      description: "Técnica exclusiva para pães integrais que não ficam pesados",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 14,
    },
    {
      id: 8,
      title: "Focaccia Italiana Autêntica",
      description: "Segredos da verdadeira focaccia com azeite extra virgem",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 16,
    },
    {
      id: 9,
      title: "Pão de Queijo Mineiro Tradicional",
      description: "A receita autêntica que faz sucesso em todo o Brasil",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 18,
    },
    {
      id: 10,
      title: "Coletânea Completa de Pães Artesanais",
      description: "Todas as técnicas avançadas e receitas exclusivas em um só lugar",
      image: "/placeholder.svg?height=200&width=300",
      unlocked: false,
      requiredCorrect: 20,
    },
  ]

  const tips = [
    {
      title: "Temperatura da Água",
      description:
        "Use água morna (não quente) para ativar o fermento adequadamente. A temperatura ideal é entre 35°C e 40°C.",
      icon: "thermometer",
    },
    {
      title: "Sova Adequada",
      description:
        "Sove a massa por pelo menos 10 minutos para desenvolver o glúten corretamente e garantir um pão macio e elástico.",
      icon: "hand",
    },
    {
      title: "Fermentação Lenta",
      description:
        "Para mais sabor, deixe a massa fermentar na geladeira por 8-12 horas. Isso desenvolve aromas complexos no pão.",
      icon: "clock",
    },
    {
      title: "Vapor no Forno",
      description:
        "Coloque uma forma com água quente no fundo do forno para criar vapor, o que ajuda na expansão do pão e na formação da crosta.",
      icon: "cloud",
    },
  ]

  useEffect(() => {
    createFlourParticles()
  }, [])

  useEffect(() => {
    // Atualiza o nível com base no XP atual
    let newLevel = 1
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xp) {
        newLevel = levels[i].level
        break
      }
    }

    if (newLevel > currentLevel) {
      // Subiu de nível
      setTimeout(() => {
        triggerConfetti()
      }, 300)
    }

    setCurrentLevel(newLevel)
  }, [xp, currentLevel])

  // Efeito para desbloquear receitas com base nas respostas corretas
  useEffect(() => {
    const newUnlockedRecipes = [...unlockedRecipes]

    recipes.forEach((recipe) => {
      if (correctAnswers >= recipe.requiredCorrect && !newUnlockedRecipes.includes(recipe.id)) {
        newUnlockedRecipes.push(recipe.id)

        // Mostrar notificação de nova receita desbloqueada
        if (correctAnswers > 0) {
          // Evita mostrar na inicialização
          setTimeout(() => {
            triggerConfetti()
          }, 300)
        }
      }
    })

    if (newUnlockedRecipes.length !== unlockedRecipes.length) {
      setUnlockedRecipes(newUnlockedRecipes)
    }
  }, [correctAnswers, unlockedRecipes])

  const createFlourParticles = () => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-[5px] h-[5px] bg-white/80 rounded-full shadow-sm animate-float z-10"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 5}s`
      particle.style.width = `${Math.random() * 5 + 2}px`
      particle.style.height = particle.style.width
      document.body.appendChild(particle)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFFFFF", "#8B4513"],
    })
  }

  const updateXP = (correct) => {
    if (correct) {
      setXp((prev) => prev + 25)
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setXp((prev) => Math.max(0, prev - 10))
    }
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correct

    setIsCorrect(correct)
    setShowFeedback(true)
    updateXP(correct)

    if (correct) {
      triggerConfetti()
      playSound("success")
    } else {
      playSound("incorrect")
    }
  }

  const playSound = (type) => {
    const sound = document.getElementById(`${type}-sound`)
    if (sound) {
      sound.currentTime = 0
      sound.play().catch((e) => console.error(`${type} sound playback failed:`, e))
    }
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setSelectedAnswer("")

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowCompletionModal(true)
    }
  }

  const handlePurchase = () => {
    setPurchaseLoading(true)

    // Simulação de processamento de pagamento
    setTimeout(() => {
      setPurchaseLoading(false)
      setPurchaseSuccess(true)

      // Mostrar confetti para celebrar a compra
      triggerConfetti()
    }, 2000)
  }

  const getCurrentLevelProgress = () => {
    const currentLevelXP = levels[currentLevel - 1].xp
    const nextLevelXP = currentLevel < levels.length ? levels[currentLevel].xp : currentLevelXP
    return currentLevel < levels.length
      ? Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
      : 100
  }

  const getXPToNextLevel = () => {
    const nextLevelXP = currentLevel < levels.length ? levels[currentLevel].xp : levels[currentLevel - 1].xp
    return currentLevel < levels.length ? nextLevelXP - xp : 0
  }

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "bread":
        return <Bread className="h-5 w-5" />
      case "flame":
        return <Flame className="h-5 w-5" />
      case "thermometer":
        return <Star className="h-5 w-5" />
      case "wheat":
        return <Wheat className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      case "hourglass":
        return <Award className="h-5 w-5" />
      case "cloud":
        return <Gift className="h-5 w-5" />
      case "droplet":
        return <Gift className="h-5 w-5" />
      case "hand":
        return <Gift className="h-5 w-5" />
      case "scissors":
        return <Gift className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] bg-[url('https://www.transparenttextures.com/patterns/flour.png')] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#8B4513] my-6 font-serif relative inline-block">
          Jogo de Pães: Desbloqueie Receitas Exclusivas
          <span className="absolute bottom-0 left-[10%] right-[10%] h-1 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent"></span>
        </h1>

        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="font-medium">{xp} XP</div>
              <div className="font-medium">Próximo nível: {getXPToNextLevel()} XP</div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-[#FFC107]" />
              <span className="font-bold">
                Nível {currentLevel}: {levels[currentLevel - 1].name}
              </span>
            </div>
            <Progress value={getCurrentLevelProgress()} className="h-5" />
          </CardContent>
        </Card>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-center mb-6">
          <div className="flex items-center justify-center gap-2 font-medium text-amber-800">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span>
              Respostas corretas: {correctAnswers} de {questions.length}
            </span>
          </div>
          <p className="text-sm mt-1">A cada 2 respostas corretas você desbloqueia uma receita exclusiva!</p>
        </div>

        <Tabs defaultValue="quiz" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="quiz">Jogo</TabsTrigger>
            <TabsTrigger value="recipes">
              Receitas ({unlockedRecipes.length})
              {unlockedRecipes.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-200 text-amber-800">
                  Novo
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
                </CardTitle>
                <CardDescription>
                  Responda corretamente para ganhar XP e desbloquear receitas exclusivas!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-medium text-center">{questions[currentQuestionIndex].question}</div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-center text-sm">
                  <Gift className="inline-block mr-2 h-4 w-4 text-amber-600" />
                  Desbloqueie as melhores receitas de pães fofinhos da internet!
                </div>

                {questions[currentQuestionIndex].image && (
                  <div className="flex justify-center my-4">
                    <img
                      src={questions[currentQuestionIndex].image || "/placeholder.svg"}
                      alt="Imagem da pergunta"
                      className="max-w-[70%] rounded-lg transition-transform hover:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-center font-medium text-[#8B4513] mb-4 relative pb-2">
                    Escolha uma das respostas:
                    <span className="absolute bottom-0 left-[30%] right-[30%] h-0.5 bg-gradient-to-r from-transparent via-[#D2B48C] to-transparent"></span>
                  </h3>

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                    {questions[currentQuestionIndex].options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center rounded-lg border p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                          selectedAnswer === option.text ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"
                        }`}
                        onClick={() => setSelectedAnswer(option.text)}
                      >
                        <RadioGroupItem value={option.text} id={`option-${index}`} className="sr-only" />
                        <Label htmlFor={`option-${index}`} className="flex items-center w-full cursor-pointer">
                          <div className="bg-[#8B5A2B] text-white p-2 rounded-md mr-3">{renderIcon(option.icon)}</div>
                          <span className="text-lg">{option.text}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {showFeedback && (
                  <div
                    className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <h3 className={`text-xl font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "Resposta Correta! ✅" : "Resposta Incorreta! ❌"}
                    </h3>
                    <p className="my-2">
                      {isCorrect
                        ? questions[currentQuestionIndex].feedbackCorrect
                        : questions[currentQuestionIndex].feedbackIncorrect}
                    </p>
                    <div className="mt-3 bg-white p-3 rounded border">
                      <h4 className="font-bold text-[#8B4513]">Explicação:</h4>
                      <p>{questions[currentQuestionIndex].explanation}</p>
                    </div>

                    {isCorrect && correctAnswers % 2 === 0 && correctAnswers > 0 && (
                      <div className="mt-4 bg-amber-100 p-3 rounded-lg border border-amber-300">
                        <h4 className="font-bold text-amber-800 flex items-center">
                          <Unlock className="h-5 w-5 mr-2" />
                          Nova Receita Desbloqueada!
                        </h4>
                        <p className="text-amber-800">
                          Você desbloqueou a receita: {recipes.find((r) => r.requiredCorrect === correctAnswers)?.title}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2 bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-200"
                          onClick={() => setActiveTab("recipes")}
                        >
                          Ver Receita
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!showFeedback ? (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8F00] text-white"
                  >
                    Verificar Resposta
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-[#8B4513] to-[#A67B5B] hover:from-[#A67B5B] hover:to-[#8B4513] text-white"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultados"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
              <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                Como funciona:
              </h3>
              <p className="text-sm">
                Ao responder corretamente as perguntas do jogo, você desbloqueia mais receitas. Quanto mais perguntas
                você acertar, mais receitas serão desbloqueadas! Para acessar todas as receitas desbloqueadas, é
                necessário fazer a compra final.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden ${unlockedRecipes.includes(recipe.id) ? "" : "opacity-70"}`}
                >
                  <div className="relative">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-40 object-cover"
                    />
                    {!unlockedRecipes.includes(recipe.id) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="h-8 w-8 mx-auto mb-2" />
                          <p>Desbloqueie com {recipe.requiredCorrect} respostas corretas</p>
                        </div>
                      </div>
                    )}
                    {unlockedRecipes.includes(recipe.id) && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">Desbloqueado</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    </div>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col items-start">
                    <div className="mb-2 w-full">
                      {unlockedRecipes.includes(recipe.id) ? (
                        <div className="flex items-center">
                          <span className="line-through text-gray-500 mr-2">R$19,00</span>
                          <span className="text-green-600 font-bold">R$0,00</span>
                          <Badge className="ml-auto bg-amber-100 text-amber-800 hover:bg-amber-200">Desbloqueado</Badge>
                        </div>
                      ) : (
                        <div>
                          <span className="text-gray-500">R$19,00</span>
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      variant={unlockedRecipes.includes(recipe.id) ? "default" : "outline"}
                      disabled={!unlockedRecipes.includes(recipe.id)}
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      {unlockedRecipes.includes(recipe.id) ? "Comprar para Acessar" : "Bloqueado"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {unlockedRecipes.length > 0 && (
              <Card className="mt-6 bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Acesse Todas as Receitas Desbloqueadas
                  </CardTitle>
                  <CardDescription>
                    Você já desbloqueou {unlockedRecipes.length} receitas exclusivas! Acesse todas elas agora mesmo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="line-through text-gray-500">
                        {unlockedRecipes.length} receitas x R$19,00 = R${unlockedRecipes.length * 19},00
                      </div>
                      <div className="text-2xl font-bold text-green-600">Apenas R$37,00</div>
                      <div className="text-sm text-green-700">Economize R${unlockedRecipes.length * 19 - 37},00</div>
                    </div>
                    <Badge className="bg-red-500 text-white text-lg py-1 px-3">
                      -{Math.round((1 - 37 / (unlockedRecipes.length * 19)) * 100)}%
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    onClick={() => setShowPurchaseModal(true)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Comprar Agora por R$37,00
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {renderIcon(tip.icon)}
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {showCompletionModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Parabéns, {levels[currentLevel - 1].name}! 🎉</CardTitle>
                <CardDescription>Você completou o jogo com {xp} XP!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Você demonstrou grande conhecimento sobre a arte de fazer pães!</p>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-800 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Você desbloqueou:
                  </h3>
                  <p className="mt-2">{unlockedRecipes.length} Receitas Exclusivas de Pães!</p>
                  <p className="mt-1 text-sm">Compre agora para acessar todas as receitas desbloqueadas.</p>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-2">Acesse todas as receitas desbloqueadas:</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="line-through text-gray-500">
                        {unlockedRecipes.length} receitas x R$19,00 = R${unlockedRecipes.length * 19},00
                      </div>
                      <div className="text-2xl font-bold text-green-600">Apenas R$37,00</div>
                      <div className="text-sm text-green-700">Economize R${unlockedRecipes.length * 19 - 37},00</div>
                    </div>
                    <Badge className="bg-red-500 text-white text-lg py-1 px-3">
                      -{Math.round((1 - 37 / (unlockedRecipes.length * 19)) * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompletionModal(false)
                    setActiveTab("recipes")
                  }}
                  className="flex-1"
                >
                  Ver Receitas
                </Button>
                <Button
                  onClick={() => {
                    setShowCompletionModal(false)
                    setShowPurchaseModal(true)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Comprar Agora
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {showPurchaseModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {purchaseSuccess ? "Compra Realizada com Sucesso!" : "Complete sua Compra"}
                </CardTitle>
                <CardDescription>
                  {purchaseSuccess
                    ? "Suas receitas exclusivas estão disponíveis!"
                    : "Acesse todas as receitas desbloqueadas por apenas R$37,00"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchaseSuccess ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-lg">Parabéns! Você agora tem acesso a todas as receitas exclusivas.</p>
                    <p className="mt-2 text-gray-600">Um e-mail com os detalhes de acesso foi enviado para você.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h3 className="font-bold text-amber-800">O que você vai receber:</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <span>Acesso a todas as {unlockedRecipes.length} receitas desbloqueadas</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <span>Técnicas exclusivas de fermentação e modelagem</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <span>Guia completo de ingredientes e equipamentos</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <span>Acesso vitalício a todas as atualizações</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="line-through text-gray-500">De R${unlockedRecipes.length * 19},00</div>
                        <div className="text-2xl font-bold">Por R$37,00</div>
                      </div>
                      <Badge className="bg-red-500 text-white">Oferta por tempo limitado</Badge>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 inline-block mr-1" />
                      Pagamento 100% seguro. Satisfação garantida ou seu dinheiro de volta em até 7 dias.
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                {purchaseSuccess ? (
                  <Button
                    onClick={() => {
                      setShowPurchaseModal(false)
                      setActiveTab("recipes")
                    }}
                    className="w-full"
                  >
                    Acessar Minhas Receitas
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="flex-1">
                      Voltar
                    </Button>
                    <Button
                      onClick={handlePurchase}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={purchaseLoading}
                    >
                      {purchaseLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Processando...
                        </div>
                      ) : (
                        <>Finalizar Compra - R$37,00</>
                      )}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        )}

        <audio
          id="success-sound"
          src="https://store-screenapp-production.storage.googleapis.com/vid/680f1df7d92b2914716649f7/eb94f5b6-511b-458b-b32d-e93b0ad616ce.mp3"
          preload="auto"
        ></audio>
        <audio
          id="incorrect-sound"
          src="https://archive.org/download/fail-144746/fail-144746.mp3"
          preload="auto"
        ></audio>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(20px) rotate(180deg); opacity: 0.4; }
          100% { transform: translateY(100vh) translateX(-20px) rotate(360deg); opacity: 0; }
        }
        
        .animate-float {
          animation:  rotate(360deg); opacity: 0; }
        }
        
        .animate-float {
          animation: float 12s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
