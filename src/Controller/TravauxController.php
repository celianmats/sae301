<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TravauxController extends AbstractController
{
    #[Route('/travaux', name: 'app_travaux')]
    public function index(): Response
    {
        return $this->render('travaux/index.html.twig', [
        ]);
    }
}
